import { Router } from 'express'
import healthRoutes from './health.routes.js'
import dbRoutes from './db.routes.js'

const router = Router()

// /api/health
router.use('/health', healthRoutes)
router.use('/db', dbRoutes)

export default router