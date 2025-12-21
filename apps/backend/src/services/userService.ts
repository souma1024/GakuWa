import bcrypt from 'bcrypt'

import { ApiError } from "../errors/apiError"
import { userRepository } from "../repositories/userRepository"
import { generateSixDigitCode } from '../utils/otpGenerator'
import { sendVerificationEmail } from './sendEmailService'
import { emailOtpRepository } from '../repositories/emailOtpRepository'
import { generateUniqueHandle } from '../utils/handleNameGenerator'
import { sessionService } from './sessionService'
import { prisma } from '../lib/prisma'

type user = {
  handle: string;
  name: string;
  avatarUrl: string;
  profile: string | null;
  followersCount: number;
  followingsCount: number;
}

export const userService = {
  async login(email: string, password: string): Promise<user> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError('authentication_error', 'ユーザーが存在しません');
    }

    const ok =  bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new ApiError('authentication_error', 'ユーザーが存在しません');
    }
    return user;
  },

  // ユーザー本登録関数
  async signup(name: string, email: string, passwordHash: string, public_token: string) {
    const handle = await generateUniqueHandle(name);

    const sameEmail = await userRepository.findByEmail(email);
    if (sameEmail) {
      throw new ApiError('duplicate_error', 'そのメールアドレスは既に使用されています');
    }

    const { user, isDisabled, sessionToken } = await prisma.$transaction(async (tx) => {
      const user = await userRepository.registerUser(tx, name, handle, email, passwordHash);
      const isDisabled = await emailOtpRepository.disableOtp(tx, public_token);
      const sessionToken = await sessionService.createSession(tx, user.id);
      return { user, isDisabled, sessionToken };
    });

    
    if (!user) {
      throw new ApiError('database_error', '新規登録に失敗しました');
    }
    
    if (!isDisabled) {
      throw new ApiError('database_error', 'OTP削除に失敗しました');
    }

    return { user, sessionToken };
  },
  
  // ユーザー仮登録関数
  async preSignup(name: string, email: string, password: string) {

    const sameEmail = await userRepository.findByEmail(email);
    if (sameEmail) {
      throw new ApiError('duplicate_error', 'そのメールアドレスは既に使用されています');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2. トークンを生成
    const otpCode = generateSixDigitCode(); // これはメールでユーザーに送る「数字」
    const publicToken = crypto.randomUUID(); // これは画面側に返す「ランダムな文字列」

    // 3. OTPコードもハッシュ化！
    // もしDBの中身を見られても認証コードがバレないように、こっちもハッシュ化して保存するのが安全らしいです
    const otpHash = await bcrypt.hash(otpCode, 10);

    // 有効期限を設定（とりあえず今から15分後にしてます）
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 試行回数
    const attempts: number = 0;

    const input = {
      name: name, 
      email:email, 
      password_hash: passwordHash, 
      public_token: publicToken, 
      code_hash: otpHash, 
      expired_at: expiresAt, 
      attempts: attempts, 
      created_at: new Date() 
    };

    const preUser = await emailOtpRepository.registerEmailOtp(input);

    if (!preUser) {
      throw new ApiError('database_error', '仮登録に失敗しました');
    }

    const send = await sendVerificationEmail(email, otpCode);

    if (!send) {
      throw new ApiError('external_service_error', 'メール送信に失敗しました');
    }

    return (await preUser).publicToken;
  }
}