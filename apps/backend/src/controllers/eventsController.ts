import { NextFunction, Request, Response } from "express";

import { sendSuccess } from '../utils/sendSuccess';
import { eventsService } from "../services/eventsService";
import { ApiError } from '../errors/apiError'

export const eventsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.userId;

    if (!userId) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が存在しません");
    }

    const events = await eventsService.getEventsWithParticipation(userId);

    console.log("events:", events);  // ← デバッグ用に追加
    console.log("type:", typeof events);  // ← 型を確認
    console.log("isArray:", Array.isArray(events));  // ← 配列か確認

    return sendSuccess(res, { events });
  } catch(e) {
    return next(e);
  }
};
