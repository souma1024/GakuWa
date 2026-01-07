import bcrypt from 'bcrypt'

import { ApiError } from "../errors/apiError"
import { userRepository } from "../repositories/userRepository"
import { generateSixDigitCode } from '../utils/otpGenerator'
import { emailService } from './emailService'
import { emailOtpRepository } from '../repositories/emailOtpRepository'
import { generateUniqueHandle } from '../utils/handleNameGenerator'
import { sessionService } from './sessionService'
import { LoginResponse } from '../dtos/users/responseDto'
import { prisma } from '../lib/prisma'
import { LoginRequest, PreSignupRequest } from '../dtos/users/requestDto'
import { Cookie } from '../dtos/Cookie'
import { Prisma } from '@prisma/client'

export const userService = {
  async login(input: LoginRequest): Promise<LoginResponse & Cookie> {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new ApiError('authentication_error', 'ユーザーが存在しません');
    }

    const ok = await bcrypt.compare(input.password, user.passwordHash);

    if (!ok) {
      throw new ApiError(
        'authentication_error',
        'メールアドレスもしくはパスワードが異なります'
      );
    }

    // ★ セッションを作成（これが無かった）
    const sessionToken = await sessionService.createSession(user.id);

    return {
      handle: user.handle,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      followersCount: user.followersCount,
      followingsCount: user.followingsCount,
      role: user.role,
      sessionToken,
    };
  },

  async cookielogin(userId: bigint): Promise<LoginResponse> {
    
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError('authentication_error', 'ユーザーが存在しません');
    }

    return {
      handle: user.handle,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      followersCount: user.followersCount,
      followingsCount: user.followingsCount,
      role: user.role
    };
  },

  // ユーザー本登録関数
  async signup(name: string, email: string, passwordHash: string, public_token: string) {
    const handle = await generateUniqueHandle(name);

    const sameEmail = await userRepository.findByEmail(email);
    if (sameEmail) {
      throw new ApiError('duplicate_error', 'そのメールアドレスは既に使用されています');
    }

    const { user, isDisabled, sessionToken } = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await userRepository.registerUser(tx, name, handle, email, passwordHash);
      const isDisabled = await emailOtpRepository.disableOtp(tx, public_token);
      const sessionToken = await sessionService.createSession(user.id, tx);
      return { user, isDisabled, sessionToken };
    });

    
    if (!user) {
      throw new ApiError('database_error', '新規登録に失敗しました');
    }
    
    if (!isDisabled) {
      throw new ApiError('database_error', 'OTP削除に失敗しました');
    }

    const userInfo = {
      handle: user.handle,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      followersCount: user.followersCount,
      followingsCount: user.followingsCount,
    };

    return { userInfo, sessionToken };
  },
  
  // ユーザー仮登録関数
  async preSignup(input: PreSignupRequest): Promise<string> {

    const sameEmail = await userRepository.findByEmail(input.email);
    if (sameEmail) {
      throw new ApiError('duplicate_error', 'そのメールアドレスは既に使用されています');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    // 2. トークンを生成
    const otpCode = generateSixDigitCode(); // これはメールでユーザーに送る「数字」
    const publicToken = crypto.randomUUID(); // これは画面側に返す「ランダムな文字列」

    // 3. OTPコードもハッシュ化！
    // もしDBの中身を見られても認証コードがバレないように、こっちもハッシュ化して保存するのが安全らしいです
    const otpHash = await bcrypt.hash(otpCode, 10);

    // 有効期限を設定（とりあえず今から10分後にしてます）
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const params = {
      name: input.name,
      email: input.email, 
      password_hash: passwordHash, 
      public_token: publicToken, 
      code_hash: otpHash,
      expires_at: expiresAt
    };

    const preUser = await emailOtpRepository.registerEmailOtp(params);

    if (!preUser) {
      throw new ApiError('database_error', '仮登録に失敗しました');
    }

    await emailService.sendVerificationEmail(input.email, otpCode);

    return (await preUser).publicToken;
  },

  async updateProfile(id: bigint, name?: string, profile?: string) {

    const user = await userRepository.updateUserProfile(id, name, profile);
    if (!user) {
      throw new ApiError('database_error', 'ユーザー情報更新に失敗しました');
    }
 
    return {
      handle: user.handle,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      followersCount: user.followersCount,
      followingsCount: user.followingsCount,
    };
  }
}