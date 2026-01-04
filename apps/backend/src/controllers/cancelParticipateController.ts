import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { participateService } from '../services/participateService'
import { ApiError } from '../errors/apiError'

export const cancelParticipateController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が存在しません");
    }

    const eventId = BigInt(req.params.eventId);

    await participateService.cancelParticipate(userId, eventId);

    return sendSuccess(res, { message: "参加を取り消しました" });
  } catch (e) {
    return next(e);
  }
}
