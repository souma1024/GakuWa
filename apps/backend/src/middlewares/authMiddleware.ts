import { Request, Response, NextFunction } from "express";

import { sessionRepository } from "../repositories/sessionRepository";
import { sendError } from "../utils/response";


// ログイン済みかどうかを検証する
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session_id;
  if (!token) return sendError(res, 'authentication_error', 'ログイン済みではありません', 400);

  const session = await sessionRepository.findValidSessionByToken(token);
  if (!session) return sendError(res, 'invalid_credentials', "セッション情報が正しくありません", 400);

  next();
};