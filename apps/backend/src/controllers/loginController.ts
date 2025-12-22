import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from '../services/userService'


export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await userService.login(email, password);

    const handle = await user.handle;
    return sendSuccess(res, { handle: handle });
  } catch (e) {
    return next(e);
  }
}