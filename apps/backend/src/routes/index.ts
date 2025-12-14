import { Router } from 'express'

import { login }from '../controllers/authController'

const router = Router()

// /api/auth/login
router.post('/auth/login', login)


export default router