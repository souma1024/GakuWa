import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/sendSuccess";
import { userService } from "../services/userService";
import { LoginRequest } from "../dtos/users/requestDto";
import { LoginResponse } from "../dtos/users/responseDto";
import { Cookie } from "../dtos/Cookie";
import { setCookie } from "../utils/setCookie";


export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request: LoginRequest = req.body;

    const { user, sessionToken } = await userService.login(request);

    setCookie(res, sessionToken);

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