import { sessionRepository } from '../repositories/sessionRepository';
import crypto from 'crypto';

type checkSessionResult = 
  | { success: false, message: string }
  | { success: true, session: any}

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

    return session.sessionToken;
  },

  async checkSession(sessionToken: string): Promise<checkSessionResult> {
    const sessionInfo = await sessionRepository.findValidSessionByToken(sessionToken);
    if (!sessionInfo) {
      return {success: false, message: "セッション情報取得に失敗しました"};
    }

    if (sessionInfo.revokedAt != null) {
      return {success: false, message: "セッションが破棄されています。"};
    }

    if (sessionInfo.expiresAt <= new Date(Date.now())) {
      return {success: false, message: "有効期限が切れています"};
    }

    return {success: true, session: sessionInfo};
  },

  async expiresSession(sessionToken: string) {
    await sessionRepository.revokeSession(sessionToken);
  }
}