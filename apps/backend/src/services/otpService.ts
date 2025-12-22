import bcrypt from 'bcrypt'

import { prisma } from '../lib/prisma'
import { ApiError } from '../errors/apiError';

import { generateSixDigitCode } from '../utils/otpGenerator';
import { emailOtpRepository } from '../repositories/emailOtpRepository';

type checkOtpResult = { name: string, email: string, passwordHash: string }

export const otpService = {
  async issueOtp(public_token: string) {
    const otpCode = generateSixDigitCode(); // これはメールでユーザーに送る「数字」

     // 3. OTPコードもハッシュ化！
    // もしDBの中身を見られても認証コードがバレないように、こっちもハッシュ化して保存するのが安全らしいです
    const otpHash = await bcrypt.hash(otpCode, 10);

    // 有効期限を設定（とりあえず今から15分後にしてます）
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 試行回数
    const attempts: number = 0;

    const reOtp = await emailOtpRepository.changeOtp(public_token, otpHash, attempts, expiresAt);
    if (!reOtp) {
      throw new ApiError('database_error', 'OTPパスワード発行に失敗しました');
    }

    return reOtp;
  },

  async checkOtp(otp: string, public_token: string): Promise<checkOtpResult> {

    const emailOtp = await prisma.emailOtp.findUnique({
      where: { publicToken: public_token },
    });

    if (!emailOtp) {
      throw new ApiError('authentication_error', 'OTPレコードが存在しません');
    }

    // ===========================
    // 3. 有効期限チェック
    // ===========================
    if (new Date() > emailOtp.expiresAt) {
      throw new ApiError('authentication_error', '有効期限が切れています');
    }

    // ===========================
    // 4. 使用済みチェック
    // ===========================
    if (emailOtp.usedAt) {
      throw new ApiError('duplicate_error', 'このOTPは既に使用されています');
    }

    // ===========================
    // 5. 試行回数チェック
    // ===========================
    if (emailOtp.attempts >= 5) {
      throw new ApiError('duplicate_error', '試行回数の上限に達しました');
    }

    // ===========================
    // 6. OTPハッシュ検証
    // ===========================
    const isValid = await bcrypt.compare(otp, emailOtp.codeHash);

    if (!isValid) {
      // 試行回数をインクリメント
      await prisma.emailOtp.update({
        where: { id: emailOtp.id },
        data: { attempts: emailOtp.attempts + 1 }
      });

      throw new ApiError('invalid_credentials', 'OTPが正しくありません')
    }

    const { name: name, email: email, passwordHash: passwordHash} = await emailOtp;
    return { name, email, passwordHash };
  }
}