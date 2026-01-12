import { prisma } from '../lib/prisma';

export const teamsRepository = {
  // 空きチームを探す（メンバー < 4人）
  async findTeamWithAvailableSlot(eventId: bigint) {
    const teams = await prisma.team.findMany({
      where: { eventId },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });

    return teams.find(team => team._count.members < 4) || null;
  },

  // 新しいチームを作成
  async create(eventId: bigint, name: string) {
    return await prisma.team.create({
      data: {
        eventId,
        name,
        status: 'ready'
      }
    });
  },

  // イベント内のチーム数を取得（チーム名生成用）
  async countByEventId(eventId: bigint) {
    return await prisma.team.count({
      where: { eventId }
    });
  },

  // チームを削除
  async delete(teamId: bigint) {
    return await prisma.team.delete({
      where: { id: teamId }
    });
  }
};
