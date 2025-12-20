import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';

import { prisma } from '../lib/prisma';

/**
 * GET /api/auth/me
 * 現在のセッションからユーザー情報を取得
 */
export const getMe = async (req: Request, res: Response) => {
  try {
    // Cookieからsession_idを取得
    const sessionToken = req.cookies?.session_id;
    
    // セッションを検索
    const session = await prisma.userSession.findUnique({
      where: { sessionToken },
      include: { user: true }
    });

    if (!session) {
      return sendError(
        res,
        'authentication_error',
        'セッションが見つかりません',
        401
      );
    }

    // セッションの有効期限チェック
    if (new Date() > session.expiresAt) {
      return sendError(
        res,
        'authentication_error',
        'セッションの有効期限が切れています',
        401
      );
    }

    // セッションが無効化されているかチェック
    if (session.revokedAt) {
      return sendError(
        res,
        'authentication_error',
        'セッションが無効化されています',
        401
      );
    }

    // ユーザー情報を返す
    return sendSuccess(res, {
      handle: session.user.handle,
      name: session.user.name,
      email: session.user.email,
      avatarUrl: session.user.avatarUrl,
    });

  } catch (error) {
    console.error('認証確認エラー:', error);
    return sendError(
      res,
      'server_error',
      'サーバーエラーが発生しました',
      500
    );
  }
};
