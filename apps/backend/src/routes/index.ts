import { Router } from 'express'

import { userController } from '../controllers/userController'
import { loginController } from '../controllers/loginController'

import { authenticateUser } from '../middlewares/authMiddleware'

const router = Router()


router.post('/api/register',userController);

// /api/auth/login
router.post('/login', loginController); 

export default router
