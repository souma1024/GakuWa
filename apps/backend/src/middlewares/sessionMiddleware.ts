import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/apiError";
import { sessionService } from "../services/sessionService";
import { userRepository } from "../repositories/userRepository";

export const authenticateUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const sessionToken = req.cookies?.session_id;

    if (!sessionToken) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が保存されていません。");
    }

    const userId = await sessionService.checkSession(sessionToken);

    if (!userId) {
      throw new ApiError('not_found', 'ユーザーIDの取得に失敗しました。');
    }

    const user = await userRepository.findBacicParamsById(userId);

    if (!user) {
      throw new ApiError("authentication_error", "ユーザーが存在しません");
    }

    req.userId = user.id;
    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
