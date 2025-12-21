import { prisma } from '../lib/prisma'

export const sessionRepository = {
  // セッション作成
  async createSession(params: {
    userId: bigint;
    sessionToken: string;
    expiresAt: Date;
  }) {
    const { userId, sessionToken, expiresAt } = params;

    return await prisma.userSession.create({
      data: {
        userId,
        sessionToken,
        expiresAt,
      },
    });
  },

  // トークンからセッション取得（有効なもののみ）
  async findValidSessionByToken(sessionToken: string, now = new Date()) {
    return await prisma.userSession.findFirst({
      where: {
        sessionToken,
        revokedAt: null,
        expiresAt: {
          gt: now,
        },
      },
    });
  },

  async getSessionInfoByUserId(userId: any) {
    return await prisma.userSession.findUnique({
      where: userId,
    });
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