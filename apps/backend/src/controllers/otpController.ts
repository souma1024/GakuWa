import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/sendSuccess';

import { otpService } from '../services/otpService';
import { userService } from '../services/userService';

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
export const otpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { otp, public_token } = req.body;

    const { name, email, passwordHash } = await otpService.checkOtp(otp, public_token);

    const { user, sessionToken } = await userService.signup(name, email, passwordHash, public_token);

    res.cookie("session_id", sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const handle = await user.handle;
    return sendSuccess(res, { handle: handle });
  } catch (e) {
    return next(e)
  }
};
