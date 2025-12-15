import { Router } from 'express'
import healthRoutes from './healthRoutes'
import dbRoutes from './dbRoutes'
import { userController } from '../controllers/userController'

const router = Router()

// /api/health
router.use('/health', healthRoutes)
router.use('/db', dbRoutes)
// /
router.post('/api/register',userController);

export default router