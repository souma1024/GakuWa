import { Router } from 'express'

import authRoutes from './auth'
import { login }from '../controllers/authController'
const router = Router()

router.use('/auth', authRoutes)

// /api/auth/login
router.post('/auth/login', login)


export default router
