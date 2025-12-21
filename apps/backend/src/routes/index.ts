import { Router } from 'express';

import { signupController } from '../controllers/signupController'
import { loginController } from '../controllers/loginController'

import { otpController } from '../controllers/otpController';
import { validateBody } from '../middlewares/validationMiddleware'
import { loginFormSchema, otpVerifySchema, signupFormSchema } from '../types/validationType';

const router = Router();

// /api/auth/login
router.post('/auth/login', validateBody(loginFormSchema), loginController); 

// api/auth/signup
router.post('/auth/signup', validateBody(signupFormSchema), signupController);

// /api/auth/otp/verify
router.post('/auth/otp/verify', validateBody(otpVerifySchema), otpController);

export default router;