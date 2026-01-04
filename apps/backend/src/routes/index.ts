import { Router } from 'express'

import { loginController } from '../controllers/loginController'
import { preSignupController } from '../controllers/preSignupController'
import { otpController } from '../controllers/otpController'
import { reOtpController } from '../controllers/reOtpController'
import { validateBody } from '../middlewares/validationMiddleware'
import {
  loginFormSchema,
  otpVerifySchema,
  signupFormSchema,
} from '../types/validationType'
import { authenticateUser } from '../middlewares/sessionMiddleware'
import { indexController } from '../controllers/indexController'

// ===== イベント関連 =====
import { eventsController } from '../controllers/eventsController'
import { participateController } from '../controllers/participateController'
import { cancelParticipateController } from '../controllers/cancelParticipateController'

// ===== 記事関連 =====
import {
  createArticleController,
  getArticlesController,
  getArticleDetailController,
  updateArticleController,
  publishArticleController,
  deleteArticleController,
} from '../controllers/articleController'
import { createArticleSchema } from '../types/articleSchema'
import { updateArticleSchema } from '../types/articleSchema'

// ===== 画像関連 =====
import { imageUploadController } from '../controllers/imageUploadController'
import { imageGetController } from '../controllers/imageGetController'
import { upload } from '../middlewares/imageMiddleware'
import { createTagController } from "../controllers/tagController";

// ===== プロフィール関連 =====
import { updateProfileController } from '../controllers/updateProfileController'

const router = Router()

// ===== Auth =====
router.post('/auth/login', validateBody(loginFormSchema), loginController)
router.post('/auth/preSignup', validateBody(signupFormSchema), preSignupController)
router.post('/auth/otp/verify', validateBody(otpVerifySchema), otpController)
router.post('/auth/otp/send', reOtpController)
router.post('/auth/session', authenticateUser, indexController)

// ===== Events =====
router.get('/events', authenticateUser, eventsController)
router.post('/events/:eventId/participate', authenticateUser, participateController)
router.delete('/events/:eventId/participate', authenticateUser, cancelParticipateController)

// ===== Articles =====
router.post('/articles', validateBody(createArticleSchema), createArticleController)
router.get('/articles', getArticlesController)
router.get('/articles/:id', getArticleDetailController)
router.put('/articles/:id', validateBody(updateArticleSchema), updateArticleController)
router.patch('/articles/:id/publish', publishArticleController)
router.delete('/articles/:id', deleteArticleController)

// ===== Images =====
router.post('/images/upload', authenticateUser, upload.single('file'), imageUploadController)
router.get('/images/avatars/:handle/:key', imageGetController)
router.get('/images/avatars/:key', imageGetController)

// ===== Profile =====
router.patch('/profile', authenticateUser, updateProfileController)

router.delete("/articles/:id",/*authenticateUser,*/deleteArticleController);
// 画像関係
router.post('/images/upload', authenticateUser, upload.single('file'),  imageUploadController);
router.get('/images/avatars/:handle/:key', imageGetController);
router.get('/images/avatars/:key', imageGetController);

// プロフィール編集
router.patch('/profile', authenticateUser, updateProfileController);

// タグ作成
router.post("/tags", createTagController);


export default router;
