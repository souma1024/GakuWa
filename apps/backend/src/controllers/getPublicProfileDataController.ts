import { NextFunction, Request, Response } from 'express';

import { userService } from '../services/userService';
import { sendSuccess } from '../utils/sendSuccess';

export const getPublicProfileDataController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const handle = req.params.handle;
    const profileData = await userService.getPublicProfile(handle);

    sendSuccess(res, profileData);
  } catch (e) {
    return next(e);
  }
}