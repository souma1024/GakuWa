import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  // ① 入力チェック
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        type: 'validation_error',
        message: 'emailとpasswordは必須です',
        fields: ['email', 'password'],
      },
    })
  }

  // ② ユーザ検索
  const user = await prisma.user.findUnique({
    where: { email },
  })

  // ③ ユーザがいない or パスワード違い
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: {
        type: 'auth_error',
        message: 'メールアドレスまたはパスワードが異なります',
        fields: ['email', 'password'],
      },
    })
  }

  // ④ 成功
  return res.json({
    success: true,
    data: {
      handle: user.handle,
    },
  })
})

export default router
