import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import { prisma } from '../lib/prisma'

const router = Router()

/* =========================
   POST /login
========================= */
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

/* =========================
   POST /otp/send
   OTP 再送用
========================= */
router.post('/otp/send', async (req: Request, res: Response) => {
  try {
    const { public_token } = req.body

    // ① 必須チェック
    if (!public_token) {
      return res.status(400).json({
        success: false,
        error: {
          type: 'validation_error',
          message: 'public_token が必要です',
          fields: ['public_token'],
        },
      })
    }

    // ② EmailOtp 取得（User も一緒に）
    const emailOtp = await prisma.emailOtp.findUnique({
      where: { publicToken: public_token },
      include: { user: true },
    })

    if (!emailOtp) {
      return res.status(404).json({
        success: false,
        error: {
          type: 'not_found',
          message: 'OTP情報が見つかりません',
        },
      })
    }

    // ③ OTP生成（6桁）
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // ④ ハッシュ化
    const codeHash = await bcrypt.hash(otp, 10)

    // ⑤ EmailOtp 更新（再送）
    await prisma.emailOtp.update({
      where: { id: emailOtp.id },
      data: {
        codeHash,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10分
        attempts: 0,
        usedAt: null,
      },
    })

    // ⑥ メール送信
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
    })

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: emailOtp.user.email,
      subject: 'ワンタイムパスワード',
      text: `あなたのワンタイムパスワードは ${otp} です。\n10分以内に入力してください。`,
    })

    // ⑦ 成功レスポンス
    return res.json({
      success: true,
      data: {
        message: 'メール送信に成功しました',
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
