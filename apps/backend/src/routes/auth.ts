import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/login', async (req, res) => {
  res.json({ success: true })
})

export default router
