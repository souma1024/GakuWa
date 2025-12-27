import { Request, Response, NextFunction } from "express";

import { sessionService } from "../services/sessionService";
import { ApiError } from "../errors/apiError"; 


// ログイン済みかどうかを検証する
// ログイン済みじゃないとアクセスできないAPI（eventやprofileなど）の前に呼び出す。
export const authenticateUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies?.session_id;
  
    if (!sessionToken) {
      throw new ApiError('authentication_error', 'ブラウザにセッション情報が保存されていません。');
    }
 
    const userId = await sessionService.checkSession(sessionToken);

    req.userId = userId;

    return next();
  } catch(e) {
    return next(e);
  }
};