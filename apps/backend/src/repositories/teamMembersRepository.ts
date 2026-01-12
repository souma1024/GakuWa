import { prisma } from '../lib/prisma';
import { TeamRole } from '@prisma/client';

export const teamMembersRepository = {
  // メンバーを追加
  async create(teamId: bigint, userId: bigint, role: TeamRole) {
    return await prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role
      }
    });
  },

  // ユーザーがイベントでどのチームに所属しているか確認
  async findByUserAndEvent(userId: bigint, eventId: bigint) {
    return await prisma.teamMember.findFirst({
      where: {
        userId,
        team: {
          eventId
        }
      },
      include: {
        team: true
      }
    });
  },

  // チームからメンバーを削除
  async delete(teamId: bigint, userId: bigint) {
    return await prisma.teamMember.delete({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      }
    });
  },

  // リーダーを変更
  async updateRole(teamId: bigint, userId: bigint, role: TeamRole) {
    return await prisma.teamMember.update({
      where: {
        teamId_userId: {
          teamId,
          userId
        }
      },
      data: { role }
    });
  },

  // チームのメンバー一覧を取得
  async findByTeamId(teamId: bigint) {
    return await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            handle: true
          }
        }
      }
    });
  }
};
