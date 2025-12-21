import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/sendSuccess';

import { otpService } from '../services/otpService';

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
export const otpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { public_token, otp } = req.body;

    const { handle, sessionToken } = await otpService.checkOtp(otp, public_token);

    res.cookie("session_id", sessionToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return sendSuccess(res, {handle: handle});
  } catch (e) {
    return next(e)
  }
};
