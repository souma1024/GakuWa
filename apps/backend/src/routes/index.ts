import { Router } from 'express'

import { userController } from '../controllers/userController'
import authRoutes from './auth'
import { login }from '../controllers/authController'
const router = Router()


router.post('/api/register',userController);

router.use('/auth', authRoutes)


// /api/auth/login
router.post('/auth/login', login)


export default router
