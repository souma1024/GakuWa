import { ApiError } from '../errors/apiError'
import { participateRepository } from '../repositories/participateRepository'

export const participateService = {

  // イベントに参加登録する
  async participate(userId: bigint, eventId: bigint) {
    // すでに参加済みかチェック
    const existing = await participateRepository.findByUserAndEvent(userId, eventId);
    if (existing) {
      throw new ApiError('duplicate_error', 'すでにこのイベントに参加しています');
    }

    // 参加登録
    return await participateRepository.create(userId, eventId);
  }

}
