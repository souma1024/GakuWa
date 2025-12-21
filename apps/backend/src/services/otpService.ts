import bcrypt from 'bcrypt'

import { prisma } from '../lib/prisma'
import { ApiError } from '../errors/apiError';

import { sessionService } from './sessionService';

type checkOtpResult = { handle: string, sessionToken: string }

export const otpService = {
  async checkOtp(otp: string, public_token: string): Promise<checkOtpResult> {

    const emailOtp = await prisma.emailOtp.findUnique({
      where: { publicToken: public_token },
      include: { user: true }
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

    // ===========================
    // 7. ユーザー本登録 (statusをactiveに)
    // ===========================
    const updatedUser = await prisma.user.update({
      where: { id: emailOtp.userId },
      data: { status: 'active' }
    });
    const handle: string = updatedUser.handle;
    // ===========================
    // 8. EmailOtpを使用済みにする
    // ===========================
    await prisma.emailOtp.update({
      where: { id: emailOtp.id },
      data: { usedAt: new Date() }
    });

    // セッション情報の作成とセッショントークンをクッキーに保存している。
    const sessionToken = await sessionService.createSession(updatedUser.id);
    return { handle, sessionToken };
  }
}