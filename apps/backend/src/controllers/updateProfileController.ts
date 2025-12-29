import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from '../services/userService';
import { ApiError } from '../errors/apiError';


export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      throw new ApiError('authentication_error', 'セッション情報が保存されていません');
    }
    const name: string | undefined = req.body.name;
    const profile: string | undefined = req.body.profile;

    const response = await userService.updateProfile(userId, name, profile);
    
    sendSuccess(res, response);
  } catch (e) {
    return next(e);
  }
}