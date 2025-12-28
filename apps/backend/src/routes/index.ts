import { Router } from 'express'

import { loginController } from '../controllers/loginController'
import { preSignupController } from '../controllers/preSignupController'
import { otpController } from '../controllers/otpController'
import { reOtpController } from '../controllers/reOtpController'
import { validateBody } from '../middlewares/validationMiddleware'
import { loginFormSchema, otpVerifySchema, signupFormSchema } from '../types/validationType';
import { authenticateUser } from '../middlewares/sessionMiddleware';
import { indexController } from '../controllers/indexController';
import {
  createArticleController,
  getArticlesController,
  getArticleDetailController,
  updateArticleController,
  publishArticleController,
  deleteArticleController,
} from "../controllers/articleController";

import { createArticleSchema } from '../types/articleSchema';
import { updateArticleSchema } from "../types/articleSchema";

const router = Router();

// /api/auth/login
router.post('/auth/login', validateBody(loginFormSchema), loginController); 

// /api/auth/preSignup
router.post('/auth/preSignup', validateBody(signupFormSchema), preSignupController); 

// /api/auth/otp/verify
router.post('/auth/otp/verify', validateBody(otpVerifySchema), otpController);

// /api/auth/otp/send
router.post('/auth/otp/send', reOtpController);
// /api/auth/session
router.post('/auth/session', authenticateUser, indexController);

// /api/articles
router.post('/articles', /*authenticateUser,*/ validateBody(createArticleSchema), createArticleController);

// 下書き一覧取得
router.get("/articles", /*authenticateUser,*/ getArticlesController);

// 記事詳細取得
router.get("/articles/:id", /*authenticateUser,*/ getArticleDetailController);

// 下書き更新
router.put("/articles/:id",/*authenticateUser,*/validateBody(updateArticleSchema),updateArticleController);

router.patch("/articles/:id/publish",/*authenticateUser,*/publishArticleController);

router.delete("/articles/:id",/*authenticateUser,*/deleteArticleController);
export default router;