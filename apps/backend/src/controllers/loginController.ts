import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/sendSuccess";
import { userService } from "../services/userService";
import { LoginRequest } from "../dtos/users/requestDto";
import { Cookie } from "../dtos/Cookie";
import { LoginResponse } from "../dtos/users/responseDto";
import { setCookie } from "../utils/setCookie";

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request: LoginRequest = req.body;

    const userInfo: LoginResponse & Cookie = await userService.login(request);

    setCookie(res, userInfo.sessionToken);

    return sendSuccess(res, {
      handle: userInfo.handle,
      name: userInfo.name,
      avatarUrl: userInfo.avatarUrl,
      profile: userInfo.profile,
      followersCount: Number(userInfo.followersCount),
      followingsCount: Number(userInfo.followingsCount),
      role: userInfo.role,
    });
  } catch (e) {
    return next(e);
  }
};
