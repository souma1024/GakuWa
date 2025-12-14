import { Router } from 'express';
import healthRoutes from './healthRoutes';
import dbRoutes from './dbRoutes';
import otpRoutes from './otpRoutes';
import authRoutes from './authRoutes';

const router = Router();

// /api/health
router.use('/health', healthRoutes);

// /api/db
router.use('/db', dbRoutes);

// /api/auth/otp
router.use('/auth/otp', otpRoutes);

// /api/auth
router.use('/auth', authRoutes);

export default router;
