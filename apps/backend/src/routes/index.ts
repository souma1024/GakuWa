import { Router } from 'express'
import authRoutes from './auth'
import healthRoutes from './healthRoutes'
import dbRouter from './dbRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/health', healthRoutes)
router.use('/db', dbRouter)

export default router
