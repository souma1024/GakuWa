import { Router } from 'express'

import { loginController } from '../controllers/loginController'
import { preSignupController } from '../controllers/preSignupController'
import { otpController } from '../controllers/otpController'
import { reOtpController } from '../controllers/reOtpController'
import { validateBody } from '../middlewares/validationMiddleware'
import { loginFormSchema, otpVerifySchema, signupFormSchema } from '../types/validationType'
import { authenticateUser } from '../middlewares/sessionMiddleware';
import { indexController } from '../controllers/indexController';
import { imageUploadController } from '../controllers/imageUploadController'
import { imageGetController } from '../controllers/imageGetController'
import { updateProfileController } from '../controllers/updateProfileController'
import { upload } from '../middlewares/imageMiddleware'

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

// 画像関係
router.post('/images/upload', authenticateUser, upload.single('file'),  imageUploadController);
router.get('/images/avatars/:handle/:key', imageGetController);
router.get('/images/avatars/:key', imageGetController);

// プロフィール編集
router.patch('/profile', authenticateUser, updateProfileController);

export default router;