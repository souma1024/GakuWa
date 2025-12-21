import { Router } from 'express';

import { signupController } from '../controllers/signupController'
import { loginController } from '../controllers/loginController'

import { authenticateUser } from '../middlewares/authMiddleware'
import { verifyOtp } from '../controllers/otpController';
import { getMe } from '../controllers/authMeController';
import { validateBody } from '../middlewares/validationMiddleware'
import { loginFormSchema, otpVerifySchema, signupFormSchema } from '../types/validationType';

const router = Router();

// authenticateUserはログイン済みでないとアクセスできない情報があるとき使う

// /api/auth/login
router.post('/auth/login', validateBody(loginFormSchema), loginController); 

// api/auth/signup
router.post('/auth/signup', validateBody(signupFormSchema), signupController);

// /api/auth/otp/verify
router.post('/auth/otp/verify', validateBody(otpVerifySchema), verifyOtp);

// /api/auth/me
router.get('/auth/me', authenticateUser, getMe);

export default router;
