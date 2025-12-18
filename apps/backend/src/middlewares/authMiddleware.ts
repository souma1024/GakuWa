import { Request, Response, NextFunction } from "express";

import { sessionService } from "../services/sessionService";
import { sendError } from "../utils/response";


// ログイン済みかどうかを検証する
// ログイン済みじゃないとアクセスできないAPI（eventやprofileなど）の前に呼び出す。
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const { sessionToken } = req.cookies.sessionToken;
  
  if (!sessionToken) {
    sendError(res, 'authentication_error', 'セッション情報が保存されていません。', 403);
  }

  const result = await sessionService.checkSession(sessionToken);
  if (!result.success) {
    sendError(res, 'authentication_error', result.message,  403);
  }

  next();
};