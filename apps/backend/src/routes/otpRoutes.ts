import { Router } from 'express';
import { verifyOtp } from '../controllers/otpController';

const router = Router();

/**
 * POST /api/auth/otp/verify
 * OTPを検証してユーザーを本登録する
 */
router.post('/verify', verifyOtp);

/**
 * POST /api/auth/otp/send
 * OTPを再送信する
 * TODO: 他メンバーが実装予定
 */
// router.post('/send', resendOtp);

export default router;
