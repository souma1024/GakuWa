import { Request, Response, NextFunction } from "express";

import { sessionService } from "../services/sessionService";
import { ApiError } from "../errors/apiError"; 


// ログイン済みかどうかを検証する
// ログイン済みじゃないとアクセスできないAPI（eventやprofileなど）の前に呼び出す。
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies.session_id;
  
    if (!sessionToken) {
      return next(new ApiError('authentication_error', 'ブラウザにセッション情報が保存されていません。'));
    }
 
    const session = await sessionService.checkSession(sessionToken);
    return next();
  } catch(e) {
    return next(e);
  }
};