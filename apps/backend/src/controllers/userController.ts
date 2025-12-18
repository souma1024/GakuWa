import { Request, Response } from "express";

import { registerUser } from "../services/userEntryService";
import { sendError, sendSuccess, sendValidationError } from '../utils/response'


export const userController = async (req: Request, res: Response) => {
    try {
        // リクエストボディを受け取る
        const { email, otpId, desiredName } = req.body;
    
        // バリデーション（簡易）
        if (!email || !otpId) {
          return sendValidationError(
            res,
            'validation_error',
            '必須項目が不足しています',
            {
              email: [
                { code: "required", message: "メールアドレスは必須です" },
              ],
              password: [
                { code: "required", message: "ワンタイムパスワードは必須です" },
              ],
            }
          );
        }
    
        // 先ほどのロジックを呼び出し
        const result = await registerUser({ email, otpId, desiredName });
    
        if (result.success) {
          sendSuccess(res, result.data);
        } else {
          sendError(res, 'authentication_error', '登録失敗しました', 403);
        }
    
      } catch (error) {
        return sendError(res, 'server_error', 'サーバ内部エラー:' + error, 500);
      }
 }