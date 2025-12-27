import { NextFunction, Request, Response } from 'express'

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from '../services/userService'
import { LoginRequest } from '../dtos/users/requestDto';
import { LoginResponse } from '../dtos/users/responseDto';


export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: LoginRequest = req.body;

    const response: LoginResponse = await userService.login(request);

    return sendSuccess(res, { response });
  } catch (e) {
    return next(e);
  }
}