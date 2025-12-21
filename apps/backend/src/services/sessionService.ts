import { ApiError } from '../errors/apiError';
import { sessionRepository } from '../repositories/sessionRepository';
import crypto from 'crypto';

type checkSessionResult = { success: true, session: any}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7日

function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");  
}

export const sessionService = {
  async createSession(id: bigint) {

    const sessionToken = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const session = await sessionRepository.createSession({
      userId: id,
      sessionToken,
      expiresAt,
    });

    if (!session) {
      throw new ApiError('database_error', '新規登録に失敗しました');
    }

    return session.sessionToken;
  },

  async checkSession(sessionToken: string): Promise<checkSessionResult> {
    const sessionInfo = await sessionRepository.findValidSessionByToken(sessionToken);
    if (!sessionInfo) {
      throw new ApiError('authentication_error', 'セッション情報が保存されていません');
    }

    if (sessionInfo.revokedAt != null) {
      throw new ApiError('authentication_error', "セッションが破棄されています。");
    }

    if (sessionInfo.expiresAt <= new Date(Date.now())) {
      throw new ApiError('authentication_error', "有効期限が切れています");
    }

    return {success: true, session: sessionInfo};
  },

  async expiresSession(sessionToken: string) {
    await sessionRepository.revokeSession(sessionToken);
  }
}