import { Router } from 'express'
import healthRoutes from './healthRoutes'
import dbRoutes from './dbRoutes'

const router = Router()

// /api/health
router.use('/health', healthRoutes)
router.use('/db', dbRoutes)

export default router