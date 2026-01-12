import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/sendSuccess';

import { otpService } from '../services/otpService';
import { userService } from '../services/userService';
import { setCookie } from '../utils/setCookie';

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
export const otpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, public_token } = req.body;

    const { name, email, passwordHash } = await otpService.checkOtp(otp, public_token);

    const { userInfo, sessionToken } = await userService.signup(name, email, passwordHash, public_token);

    setCookie(res, sessionToken);

    sendSuccess(res, { userInfo });
  } catch (e) {
    return next(e)
  }
};
