import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { imageService } from '../services/imageService';
import { ApiError } from '../errors/apiError';



export const imageUploadController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    const userId = req?.userId;
    if (!userId) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が存在しません");
    }

    console.log("userID: ", userId);
    
    if (!file) {
      throw new ApiError('not_found', '画像ファイルが存在しません');
    }

    const objectKey: string = await imageService.uploadImage(file, userId);

    sendSuccess(res, objectKey);
  } catch (e) {
    return next(e);
  }
}