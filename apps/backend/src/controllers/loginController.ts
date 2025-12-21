import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from '../services/userService'


export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await userService.login(email, password);

    return sendSuccess(res, user.handle);
  } catch (e) {
    return next(e);
  }
}