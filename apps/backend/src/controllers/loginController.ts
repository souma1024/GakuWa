import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/sendSuccess";
import { userService } from "../services/userService";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user, sessionToken } = await userService.login(req.body);

    // Cookie は先にセット
    res.cookie("session_id", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
    });

    // ★ BigInt を完全に排除したレスポンス
    return sendSuccess(res, {
      handle: user.handle,
      name: user.name,
      avatarUrl: user.avatarUrl,
      profile: user.profile,
      followersCount: Number(user.followersCount),
      followingsCount: Number(user.followingsCount),
      role: user.role,
    });
  } catch (e) {
    return next(e);
  }
};
