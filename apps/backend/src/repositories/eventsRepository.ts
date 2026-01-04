import { prisma } from "../lib/prisma";

export const eventsRepository = {
  // イベント一覧を取得
  async findAll() {
    return await prisma.event.findMany({
      orderBy: {
        id: 'desc'
      }
    });
  },

  // 特定のユーザーが参加しているイベントIDの一覧を取得
  async findParticipatingEventIds(userId: bigint) {
    const participations = await prisma.eventParticipant.findMany({
      where: {
        userId: userId
      },
      select: {
        eventId: true
      }
    });
    return participations.map(p => p.eventId);
  }
};
