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

    const events = eventsService.getEventsWithParticipation(userId);

    return sendSuccess(res, { events });
  } catch(e) {
    return next(e);
  }
};
