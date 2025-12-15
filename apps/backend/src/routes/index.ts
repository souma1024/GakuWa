import { Router } from 'express';

import { login }from '../controllers/authController'
import otpRoutes from './otpRoutes';
import authRoutes from './authRoutes';

const router = Router();

router.post('/auth/login', login)

// /api/auth/otp
router.use('/auth/otp', otpRoutes);

// /api/auth
router.use('/auth', authRoutes);

export default router;
