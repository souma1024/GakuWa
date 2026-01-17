import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/apiError";
import { sessionService } from "../services/sessionService";
import { prisma } from "../lib/prisma";

export const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies?.session_id;
    if (!sessionToken) {
      throw new ApiError("authentication_error", "セッションがありません");
    }

    // セッション → userId
    const userId = await sessionService.checkSession(sessionToken);

    // ★ ユーザーをDBから必ず取る
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        handle: true,
      },
    });

    if (!user) {
      throw new ApiError("authentication_error", "ユーザーが存在しません");
    }

    req.userId = user.id;
    req.user = user;

    return next();
  } catch (e) {
    return next(e);
  }
};
