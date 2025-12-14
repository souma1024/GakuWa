import { Router } from 'express';
import { getMe } from '../controllers/authMeController';

const router = Router();

/**
 * GET /api/auth/me
 * 現在のセッションからユーザー情報を取得
 */
router.get('/me', getMe);

export default router;
