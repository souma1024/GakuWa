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

// ===== 記事関連 =====


import {
  createArticleController,
  getArticlesController,
  getArticleDetailController,
  updateArticleController,
  publishArticleController,
  deleteArticleController,
} from '../controllers/articleController'



import { createArticleSchema } from '../types/articleSchema';
import { updateArticleSchema } from "../types/articleSchema";
import { imageUploadController } from '../controllers/imageUploadController'
import { imageGetController } from '../controllers/imageGetController'
import { upload } from '../middlewares/imageMiddleware'


const router = Router()

// ===== Auth =====
router.post('/auth/login', validateBody(loginFormSchema), loginController)
router.post('/auth/preSignup', validateBody(signupFormSchema), preSignupController)
router.post('/auth/otp/verify', validateBody(otpVerifySchema), otpController)
router.post('/auth/otp/send', reOtpController)
router.post('/auth/session', authenticateUser, indexController)

// ===== Articles =====
router.post(
  '/articles',
  /* authenticateUser, */
  validateBody(createArticleSchema),
  createArticleController
)

router.get(
  '/articles',
  /* authenticateUser, */
  getArticlesController
)


router.get(
  '/articles/:id',
  /* authenticateUser, */
  getArticleDetailController
)

router.put(
  '/articles/:id',
  /* authenticateUser, */
  validateBody(updateArticleSchema),
  updateArticleController
)
// /api/articles
router.post('/articles', /*authenticateUser,*/ validateBody(createArticleSchema), createArticleController);


router.patch(
  '/articles/:id/publish',
  /* authenticateUser, */
  publishArticleController
)

router.delete(
  '/articles/:id',
  /* authenticateUser, */
  deleteArticleController
)

// ===== Images =====
router.post(
  '/images/upload',
  authenticateUser,
  upload.single('file'),
  imageUploadController
)

router.get('/images/avatars/:handle/:key', imageGetController)
router.get('/images/avatars/:key', imageGetController)


router.delete("/articles/:id",/*authenticateUser,*/deleteArticleController);
router.post('/images/upload', authenticateUser, upload.single('file'),  imageUploadController);
router.get('/images/avatars/:handle/:key', imageGetController);
router.get('/images/avatars/:key', imageGetController);

export default router
