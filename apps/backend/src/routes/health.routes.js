import { Router } from 'express'

const router = Router()

// GET /api/health
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Gakuwa backend is running',
  })
})

export default router