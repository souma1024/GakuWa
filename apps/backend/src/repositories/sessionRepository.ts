import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma'

export const sessionRepository = {
  // セッション作成
  async createSession(
    db: Prisma.TransactionClient,
    userId: bigint,
    sessionToken: string,
    expiresAt: Date,
  ) {
    
    return await db.userSession.create({
      data: {
        userId,
        sessionToken,
        expiresAt,
      },
    });
  },

  // トークンからセッション取得（有効なもののみ）
  async findValidSessionByToken(sessionTokenHash: string) {
    const session = await prisma.userSession.findUnique({
      where: {
        sessionToken: sessionTokenHash,
      }
    });
    return session;
  },

  // セッション失効（ログアウト）
  async revokeSession(sessionToken: string, revokedAt = new Date()) {
    return await prisma.userSession.updateMany({
      where: { sessionToken, revokedAt: null },
      data: { revokedAt },
    });
  },

  // ユーザーの全セッションを失効（全端末ログアウト）
  async revokeAllSessionsForUser(userId: bigint, revokedAt = new Date()) {
    return await prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt },
    });
  },
};