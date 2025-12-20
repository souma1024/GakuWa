import { Request, Response } from "express";

import { registerUser } from "../services/userEntryService";
import { sendError, sendSuccess } from '../utils/response'


export const signupController = async (req: Request, res: Response) => {
    try {
        // /signupから入力情報を受け取る
        const { name, email, password } = req.body;
        
        // 先ほどのロジックを呼び出し　後で実装
        // const result = await registerUser({ name, email, password });
    
        // if (result.success) {
        //   sendSuccess(res, result.data);
        // } else {
        //   sendError(res, 'authentication_error', '登録失敗しました', 403);
        // }
        console.log("せいこうだ");
        return sendSuccess(res);
      } catch (error) {
        return sendError(res, 'server_error', 'サーバ内部エラー:' + error, 500);
      }
 }