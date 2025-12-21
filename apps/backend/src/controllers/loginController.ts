import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { sendError, sendSuccess, sendValidationError } from '../utils/response'


export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // ② ユーザー取得
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // ③ ユーザーが存在しない
    if (!user) {
      return sendError(
        res,
        'authentication_error',
        'メールアドレスまたはパスワードが異なります',
        401
      );
    }

    // ④ パスワード検証
    const ok =  bcrypt.compare(password, user.passwordHash)  

    if (!ok) {
      return sendError(
        res,
        'authentication_error',
        'メールアドレスまたはパスワードが異なります',
        401
      );
    }

    // ⑤ 成功レスポンス
    return sendSuccess(res, user.handle);
  } catch (err) {

    return sendError(res, 'server_error', 'サーバ内部エラー:' + err, 500);
  }
}