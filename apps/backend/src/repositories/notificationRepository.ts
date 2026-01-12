import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class NotificationRepository {
  /**
   * 3日前通知（REMINDER）を送るべきイベントを抽出する
   * 条件: is_active=1 かつ 開始日が指定日の3日後 かつ まだREMINDERログがない
   */
  async findEventsForReminder(targetDate: Date) {
    // ターゲット日付の3日後を計算
    const threeDaysLater = new Date(targetDate);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);

    // 日付の範囲指定（00:00:00 ～ 23:59:59）
    const startOfDay = new Date(threeDaysLater.setHours(0, 0, 0, 0));
    const endOfDay = new Date(threeDaysLater.setHours(23, 59, 59, 999));

    return prisma.event.findMany({
      where: {
        isActive: 1, // 1 = 有効
        startDateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        // 「まだREMINDER通知の成功ログがない」イベントのみ取得
        notificationLogs: {
          none: {
            type: 'REMINDER',
            status: 'SUCCESS',
          },
        },
      },
    });
  }

  /**
   * 開始時通知（START）を送るべきイベントを抽出する
   * 条件: is_active=1 かつ 開始時刻を過ぎている かつ まだSTARTログがない
   */
  async findEventsForStart(currentDate: Date) {
    return prisma.event.findMany({
      where: {
        isActive: 1,
        startDateTime: {
          lte: currentDate, // 現在時刻を過ぎている
        },
        notificationLogs: {
          none: {
            type: 'START',
            status: 'SUCCESS',
          },
        },
      },
    });
  }

  /**
   * 通知ログを保存する
   */
  async createLog(eventId: bigint, type: 'REMINDER' | 'START', status: 'SUCCESS' | 'FAILED') {
    return prisma.notificationLog.create({
      data: {
        eventId,
        type,
        status,
        executedAt: new Date(),
      },
    });
  }
}