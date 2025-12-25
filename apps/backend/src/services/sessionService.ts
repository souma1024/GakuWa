import { ApiError } from '../errors/apiError';
import { sessionRepository } from '../repositories/sessionRepository';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';

type checkSessionResult = { success: true, session: any}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7日

function generateSessionTokenHash() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  return { token, hash };
}

function sessionTokenHashGenerator(token: string): string {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return hash;
}

export const sessionService = {
  async createSession(db: Prisma.TransactionClient,id: bigint) {

    const { token, hash } = generateSessionTokenHash();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const session = await sessionRepository.createSession(db, id, hash, expiresAt);

    if (!session) {
      throw new ApiError('database_error', 'セッション登録に失敗しました');
    }

    return token;
  },

  async updateSession(sessionToken: string) {
    const sessionTokenHash = sessionTokenHashGenerator(sessionToken);
  },

  async checkSession(sessionToken: string): Promise<checkSessionResult> {
    const sessionTokenHash = sessionTokenHashGenerator(sessionToken);
    const sessionInfo = await sessionRepository.findValidSessionByToken(sessionTokenHash);

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
    const sessionTokenHash = sessionTokenHashGenerator(sessionToken);
    await sessionRepository.revokeSession(sessionTokenHash);
  }
}