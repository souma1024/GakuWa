import { Router } from 'express';

import { login }from '../controllers/authController'
import otpRoutes from './otpRoutes';
import authRoutes from './authRoutes';
import { verifyOtp } from '../controllers/otpController';
import { getMe } from '../controllers/authMeController';

const router = Router();

router.post('/auth/login', login)

// /api/auth/otp
router.use('/auth/otp', otpRoutes);

// /api/auth
router.use('/auth', authRoutes);

// /api/auth/otp/verify
router.post('/verify', verifyOtp);

// /api/auth/me
router.get('/me', getMe);

export default router;
