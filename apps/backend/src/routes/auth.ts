import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  try {
    return res.json({
      success: true,
      data: { handle: '@abcde' }
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      error: {
        type: 'internal_error',
        message: 'サーバエラー'
      }
    })
  }
})

export default router
