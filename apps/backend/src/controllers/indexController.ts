import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from '../services/userService';
import { ApiError } from '../errors/apiError';


export const indexController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.userId;
    if (!userId) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が存在しません");
    }
    const user = await userService.cookielogin(userId);

    sendSuccess(res, user);
  } catch (e) {
    return next(e);
  }
}