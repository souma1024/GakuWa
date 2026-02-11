import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { ApiError } from '../errors/apiError';


export const authController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req?.userId;
    const user = req?.user;
    if (!userId) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が存在しません");
    }

    if (!user) {
        throw new ApiError("server_error", "予期しないエラーが発生しました");
    }

    sendSuccess(res, user.handle);
  } catch (e) {
    return next(e);
  }
}