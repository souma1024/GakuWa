import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/apiError";
import { sessionService } from "../services/sessionService";
import { prisma } from "../lib/prisma";

export const authenticateUser = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    console.log("[auth] cookies:", req.cookies);

    const sessionToken = req.cookies?.session_id;
    console.log("[auth] sessionToken:", sessionToken);

    if (!sessionToken) {
      throw new ApiError("authentication_error", "セッションがありません");
    }

    const userId = await sessionService.checkSession(sessionToken);
    console.log("[auth] userId:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, handle: true },
    });

    console.log("[auth] user:", user);

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
