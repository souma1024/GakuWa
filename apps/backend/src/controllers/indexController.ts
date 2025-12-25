import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from '../services/userService';


export const indexController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session_id = req.cookies.id;
    const user = await userService.cookielogin(session_id);

    sendSuccess(res, user);
  } catch (e) {
    return next(e);
  }
}