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
import { updateProfileController } from '../controllers/updateProfileController'
import { upload } from '../middlewares/imageMiddleware'
import { tagController } from '../controllers/tagController';
import { adminOnly } from "../middlewares/adminMiddleware";

import { createTagSchema } from "../types/tagSchema";
import { deleteTagController } from "../controllers/adminTagController";
import { updateTagSchema } from "../types/tagSchema";


import {
  getCategoriesController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/categoryController";
import { createCategorySchema, updateCategorySchema } from "../types/categorySchema";

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
// 画像関係
router.post('/images/upload', authenticateUser, upload.single('file'),  imageUploadController);
router.get('/images/avatars/:handle/:key', imageGetController);
router.get('/images/avatars/:key', imageGetController);

// プロフィール編集
router.patch('/profile', authenticateUser, updateProfileController);

router.put(
  "/admin/tags/:tagId",
  authenticateUser,
  adminOnly,
  validateBody(updateTagSchema),
  tagController.update
);

// POST /api/tags
router.post(
  "/tags",
  authenticateUser,
  validateBody(createTagSchema),
  tagController.create
);

/**
 * 管理者：タグ削除
 * DELETE /api/admin/tags/:tagId
 */
router.delete(
  "/admin/tags/:tagId",
  authenticateUser,
  adminOnly,
  deleteTagController
);

// public: カテゴリ一覧（必要なら authenticateUser を付ける）
router.get("/categories", getCategoriesController);

// admin: 作成
router.post(
  "/admin/categories",
  authenticateUser,
  adminOnly,
  validateBody(createCategorySchema),
  createCategoryController
);

// admin: 更新
router.put(
  "/admin/categories/:categoryId",
  authenticateUser,
  adminOnly,
  validateBody(updateCategorySchema),
  updateCategoryController
);

// admin: 削除
router.delete(
  "/admin/categories/:categoryId",
  authenticateUser,
  adminOnly,
  deleteCategoryController
);

export default router;
