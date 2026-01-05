import { NotificationRepository } from '../repositories/notificationRepository';
import { BatchNotifyRequest, BatchNotifyResponse } from '../types/notification';

// ダミーのメール送信関数
// ※実際には Nodemailer や SendGrid などを使用してください
const mockSendMail = async (event: any, subject: string): Promise<boolean> => {
  console.log(`[Mail Sent] Subject: ${subject}, Event: ${event.name} (ID: ${event.id})`);
  return true; 
};

export class NotificationService {
  private repo: NotificationRepository;

  constructor() {
    this.repo = new NotificationRepository();
  }

  /**
   * バッチ処理のメインロジック
   */
  async executeBatch(params: BatchNotifyRequest): Promise<BatchNotifyResponse> {
    // 1. 日付のセットアップ
    const targetDate = params.target_date ? new Date(params.target_date) : new Date();
    
    if (isNaN(targetDate.getTime())) {
      throw new Error('Invalid Date Format');
    }

    const results = {
      reminder_sent_count: 0,
      start_sent_count: 0,
      errors: [] as string[],
    };

    // 2. 3日前リマインダー処理
    if (params.execute_mode === 'all' || params.execute_mode === 'reminder') {
      const reminderEvents = await this.repo.findEventsForReminder(targetDate);
      
      for (const event of reminderEvents) {
        try {
          const subject = `【リマインド】イベント「${event.name}」が3日後に開催されます`;
          await mockSendMail(event, subject);

          // 成功ログを記録
          await this.repo.createLog(event.id, 'REMINDER', 'SUCCESS');
          results.reminder_sent_count++;
        } catch (error) {
          results.errors.push(`Reminder Error (EventID: ${event.id}): ${error}`);
        }
      }
    }

    // 3. 開始通知処理
    if (params.execute_mode === 'all' || params.execute_mode === 'start') {
      // 開始通知は「バッチ実行時の現在時刻」で判定
      const now = new Date();
      const startEvents = await this.repo.findEventsForStart(now);

      for (const event of startEvents) {
        try {
          const subject = `【開始】イベント「${event.name}」が始まりました！`;
          await mockSendMail(event, subject);

          await this.repo.createLog(event.id, 'START', 'SUCCESS');
          results.start_sent_count++;
        } catch (error) {
          results.errors.push(`Start Error (EventID: ${event.id}): ${error}`);
        }
      }
    }

    return {
      status: 'success',
      executed_at: new Date().toISOString(),
      results,
    };
  }
}