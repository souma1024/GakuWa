import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { sendError, sendSuccess, sendValidationError } from '../utils/response'


export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // ① 必須チェック
    if (!email || !password) {
      return sendValidationError(
        res,
        'validation_error',
        '必須項目が不足しています',
        {
          email: [
            { code: "required", message: "メールアドレスは必須です" },
          ],
          password: [
            { code: "min_length", message: "パスワードは8文字以上にしてください" },
            { code: "pattern", message: "英字・数字・記号を含めてください" },
          ],
        }
      );
    }

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