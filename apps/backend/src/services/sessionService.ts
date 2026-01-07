import { ApiError } from '../errors/apiError';
import { sessionRepository } from '../repositories/sessionRepository';
import crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma'; // ★ 追加

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7日

function generateSessionTokenHash() {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

function sessionTokenHashGenerator(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export const sessionService = {
  async createSession(
    userId: bigint,
    db?: Prisma.TransactionClient
  ): Promise<string> {

    const client = db ?? prisma;

    const { token, hash } = generateSessionTokenHash();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    const session = await sessionRepository.createSession(
      client,
      userId,
      hash,
      expiresAt
    );

    if (!session) {
      throw new ApiError('database_error', 'セッション登録に失敗しました');
    }

    return token;
  },

  async checkSession(sessionToken: string): Promise<bigint> {
    const sessionTokenHash = sessionTokenHashGenerator(sessionToken);
    const sessionInfo = await sessionRepository.findValidSessionByToken(sessionTokenHash);

    if (!sessionInfo) {
      throw new ApiError('authentication_error', 'セッション情報が保存されていません');
    }

    if (sessionInfo.revokedAt != null) {
      throw new ApiError('authentication_error', 'セッションが破棄されています');
    }

    if (sessionInfo.expiresAt <= new Date()) {
      throw new ApiError('authentication_error', '有効期限が切れています');
    }

    return sessionInfo.userId;
  },

  async expiresSession(sessionToken: string) {
    const sessionTokenHash = sessionTokenHashGenerator(sessionToken);
    await sessionRepository.revokeSession(sessionTokenHash);
  }
};
