import { Router } from 'express'

import { loginController } from '../controllers/loginController'
import { preSignupController } from '../controllers/preSignupController'
import { otpController } from '../controllers/otpController'
import { reOtpController } from '../controllers/reOtpController'
import { validateBody } from '../middlewares/validationMiddleware'
import { loginFormSchema, otpVerifySchema, signupFormSchema } from '../types/validationType';
import { authenticateUser } from '../middlewares/sessionMiddleware';
import { indexController } from '../controllers/indexController';
import { eventsController } from '../controllers/eventsController';
import { participateController } from '../controllers/participateController';
import { cancelParticipateController } from '../controllers/cancelParticipateController'

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

// /api/events
router.get('/events', authenticateUser, eventsController);

// /api/events/:eventId/participate
router.post('/events/:eventId/participate', authenticateUser, participateController);

// /api/events/:eventId/participate
router.delete('/events/:eventId/participate', authenticateUser, cancelParticipateController);

export default router;
