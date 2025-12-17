import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // ① 必須チェック
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'validation_error',
          message: '必須項目が不足しています',
          fields: ['email', 'password'],
        },
      })
    }

    // ② ユーザー取得
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // ③ ユーザーが存在しない
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'auth_error',
          message: 'メールアドレスまたはパスワードが異なります',
          fields: ['email', 'password'],
        },
      })
    }

    // ④ パスワード検証
    const ok = await bcrypt.compare(password, user.passwordHash)

    if (!ok) {
      return res.status(401).json({
        success: false,
        error: {
          type: 'auth_error',
          message: 'メールアドレスまたはパスワードが異なります',
          fields: ['email', 'password'],
        },
      })
    }

    // ⑤ 成功レスポンス
    return res.json({
      success: true,
      data: {
        handle: user.handle,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      error: {
        type: 'server_error',
        message: 'サーバ内部エラー',
      },
    })
  }
})

export default router
