import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService';
import { BatchNotifyRequest } from '../types/notification';

// Serviceのインスタンスを生成（シングルトン的運用）
const service = new NotificationService();

/**
 * バッチ実行用コントローラー
 * 外部スケジューラー等から POST /notifications/batch で呼び出されます。
 */
export const batchNotificationController = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: BatchNotifyRequest = req.body;

    // Serviceを実行して結果を取得
    const result = await service.executeBatch(params);

    // 成功レスポンス
    res.status(200).json(result);
  } catch (error) {
    console.error('Batch Execution Failed:', error);
    
    // エラーレスポンス
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
};