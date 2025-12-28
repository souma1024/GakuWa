import { prisma } from '../lib/prisma'

export const participateRepository = {

  // 参加登録
  async create(userId: bigint, eventId: bigint) {
    return await prisma.eventParticipant.create({
      data: {
        userId: userId,
        eventId: eventId
      }
    });
  },

  // すでに参加済みかチェック
  async findByUserAndEvent(userId: bigint, eventId: bigint) {
    return await prisma.eventParticipant.findUnique({
      where: {
        userId_eventId: {
          userId: userId,
          eventId: eventId
        }
      }
    });
  }

}
