import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { sendSuccess, sendError, sendValidationError } from '../utils/response';
import { authService } from '../services/authService';

const prisma = new PrismaClient();

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { public_token } = req.body;

    if (!public_token || typeof public_token !== 'string') {
      return sendValidationError(
        res,
        'validation_error',
        'public_tokenが必要です',
        {
          public_token: [{ message: 'public_tokenが必要です' }]
        },
        400
      );
    }

    // OTP再送ロジック（既存 service を使う想定）
    await authService.sendOtp(public_token);

    return sendSuccess(res, {
      message: 'メール送信に成功しました'
    }, 200);

  } catch (error: any) {
    if (error.type === 'not_found') {
      return sendError(
        res,
        'not_found',
        'OTPレコードが見つかりません',
        404
      );
    }
  }
};

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { public_token, otp } = req.body;

    // ===========================
    // 1. バリデーション
    // ===========================
    if (!public_token || typeof public_token !== 'string') {
      return sendValidationError(
        res,
        'validation_error',
        'public_tokenが必要です',
        {
          public_token: [{ message: 'public_tokenが必要です' }]
        },
        400
      );
    }

    if (!otp || typeof otp !== 'string') {
      return sendValidationError(
        res,
        'validation_error',
        'OTPが必要です',
        {
          otp: [{ message: 'OTPが必要です' }]
        },
        400
      );
    }

    // OTPが6桁の数字かチェック
    if (!/^\d{6}$/.test(otp)) {
      return sendValidationError(
        res,
        'format_error',
        'OTPは6桁の数字である必要があります',
        {
          otp: [{ message: 'OTPは6桁の数字である必要があります' }]
        },
        400
      );
    }

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

    // ===========================
    // 9. セッション発行 (仮実装)
    // ===========================
    // TODO: 他メンバーがセッション管理を実装したら置き換える
    // 今はダミーのセッショントークンを生成
    const crypto = require('crypto');
    const sessionToken = crypto.randomBytes(32).toString('hex');
    
    // UserSessionテーブルにセッションを保存
    const session = await prisma.userSession.create({
      data: {
        userId: updatedUser.id,
        sessionToken: sessionToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7日後
      }
    });

    // Cookieにセッションをセット (仮実装)
    res.cookie('session_id', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7日
      sameSite: 'lax'
    });

    // ===========================
    // 10. 成功レスポンス
    // ===========================
    return sendSuccess(res, {
      handle: updatedUser.handle
    }, 200);

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
