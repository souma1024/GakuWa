import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { sendSuccess, sendError, sendValidationError } from '../utils/response';
import { prisma } from '../lib/prisma';
import { sessionService } from '../services/sessionService';

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { public_token, otp } = req.body;

    // ===========================
    // 2. public_tokenでEmailOtpを検索
    // ===========================
    const emailOtp = await prisma.emailOtp.findUnique({
      where: { publicToken: public_token },
      include: { user: true }
    });

    if (!emailOtp) {
      return sendError(
        res,
        'not_found',
        'OTPレコードが見つかりません',
        404
      );
    }

    // ===========================
    // 3. 有効期限チェック
    // ===========================
    if (new Date() > emailOtp.expiresAt) {
      return sendError(
        res,
        'authentication_error',
        'OTPの有効期限が切れています',
        400
      );
    }

    // ===========================
    // 4. 使用済みチェック
    // ===========================
    if (emailOtp.usedAt) {
      return sendError(
        res,
        'authentication_error',
        'このOTPは既に使用されています',
        400
      );
    }

    // ===========================
    // 5. 試行回数チェック
    // ===========================
    if (emailOtp.attempts >= 5) {
      return sendError(
        res,
        'authentication_error',
        '試行回数の上限に達しました',
        429
      );
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

      return sendError(
        res,
        'invalid_credentials',
        'OTPが正しくありません',
        400
      );
    }

    // ===========================
    // 7. ユーザー本登録 (statusをactiveに)
    // ===========================
    const updatedUser = await prisma.user.update({
      where: { id: emailOtp.userId },
      data: { status: 'active' }
    });

    // ===========================
    // 8. EmailOtpを使用済みにする
    // ===========================
    await prisma.emailOtp.update({
      where: { id: emailOtp.id },
      data: { usedAt: new Date() }
    });

    // セッション情報の作成とセッショントークンをクッキーに保存している。
    const sessionToken = sessionService.createSession(updatedUser.id);
    res.cookie("session_id", sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // ===========================
    // 10. 成功レスポンス
    // ===========================
    return sendSuccess(res, {handle: updatedUser.handle});
  } catch (error) {
    console.error('OTP検証エラー:', error);
    return sendError(
      res,
      'server_error',
      'サーバーエラーが発生しました',
      500
    );
  }
};
