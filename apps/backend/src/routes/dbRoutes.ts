import { Router } from 'express'

const router = Router()

// GET /api/db
router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Gakuwa db is running',
  })
})

export default router