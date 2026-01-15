import { Router } from "express";

// ===== Auth =====
import { loginController } from "../controllers/loginController";
import { preSignupController } from "../controllers/preSignupController";
import { otpController } from "../controllers/otpController";
import { reOtpController } from "../controllers/reOtpController";
import { indexController } from "../controllers/indexController";
import { validateBody } from "../middlewares/validationMiddleware";
import {
  loginFormSchema,
  otpVerifySchema,
  signupFormSchema,
} from "../types/validationType";
import { authenticateUser } from "../middlewares/sessionMiddleware";

// ===== Events =====
import { eventsController } from "../controllers/eventsController";
import { participateController } from "../controllers/participateController";
import { cancelParticipateController } from "../controllers/cancelParticipateController";

// ===== Articles =====
import {
  createArticleController,
  getArticlesController,
  getUsersArticlesController,
  getArticleDetailController,
  updateArticleController,
  publishArticleController,
  deleteArticleController,
} from "../controllers/articleController";
import { createArticleSchema, updateArticleSchema } from "../types/articleSchema";

// ===== Images =====
import { imageUploadController } from "../controllers/imageUploadController";
import { imageGetController } from "../controllers/imageGetController";
import { upload } from "../middlewares/imageMiddleware";

// ===== Profile =====
import { updateProfileController } from "../controllers/updateProfileController";

// ===== Tags =====
import { adminOnly } from "../middlewares/adminMiddleware";
import { createTagSchema, updateTagSchema } from "../types/tagSchema";
import { createTagController } from "../controllers/tagController";
import {
  updateTagController,
  deleteTagController,
} from "../controllers/adminTagController";

// 【変更点】クラスではなく、関数としてインポートします
import { batchNotificationController } from '../controllers/notificationController'
import { logoutController } from "../controllers/logoutController";
import { rankingController } from "../controllers/rankingController";

const router = Router()

// ===== Auth =====
router.post("/auth/login", validateBody(loginFormSchema), loginController);
router.post("/auth/logout", authenticateUser, logoutController);
router.post("/auth/preSignup", validateBody(signupFormSchema), preSignupController);
router.post("/auth/otp/verify", validateBody(otpVerifySchema), otpController);
router.post("/auth/otp/send", reOtpController);
router.post("/auth/session", authenticateUser, indexController);

// ===== Events =====
router.get("/events", authenticateUser, eventsController);
router.post(
  "/events/:eventId/participate",
  authenticateUser,
  participateController
);
router.delete(
  "/events/:eventId/participate",
  authenticateUser,
  cancelParticipateController
);

// ===== Articles =====
router.post("/articles", validateBody(createArticleSchema), authenticateUser, createArticleController);
router.get("/articles", getArticlesController);
router.get("/:handle/articles", authenticateUser, getUsersArticlesController);
router.get("/articles/:id", getArticleDetailController);
router.put(
  "/articles/:id",
  validateBody(updateArticleSchema),
  updateArticleController
);
router.patch("/articles/:id/publish", publishArticleController);
router.delete("/articles/:id", deleteArticleController);

// ===== Images =====
router.post(
  "/images/upload",
  authenticateUser,
  upload.single("file"),
  imageUploadController
);
router.get("/images/avatars/:handle/:key", imageGetController);
router.get("/images/avatars/:key", imageGetController);

// ===== Profile =====
router.patch("/profile", authenticateUser, updateProfileController);

// ===== Tags =====

// タグ作成（ユーザー）
router.post(
  "/tags",
  authenticateUser,
  validateBody(createTagSchema),
  createTagController
);

// タグ更新（管理者）
router.put(
  "/admin/tags/:tagId",
  authenticateUser,
  adminOnly,
  validateBody(updateTagSchema),
  updateTagController
);

// タグ削除（管理者）
router.delete(
  "/admin/tags/:tagId",
  authenticateUser,
  adminOnly,
  deleteTagController
);

// ===== Notifications =====
router.post('/notifications/batch', batchNotificationController)


// ranking関係
router.get('/ranking', rankingController);

export default router
