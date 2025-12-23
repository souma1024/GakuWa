import { NextFunction, Request, Response } from 'express';
import { sendSuccess } from '../utils/sendSuccess';

import { otpService } from '../services/otpService';
import { userService } from '../services/userService';
import { emailService } from '../services/emailService';

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
export const reOtpController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { public_token } = req.body;

    const { otpCode, email } = await otpService.issueOtp(public_token);
    await emailService.sendVerificationEmail(email, otpCode);

    
    return sendSuccess(res,  'メール再送に成功しました。');
  } catch (e) {
    return next(e)
  }
};
