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

    const userInfo: LoginResponse & Cookie = await userService.login(request);

    setCookie(res, userInfo.sessionToken);

    return sendSuccess(res, { userInfo });
  } catch (e) {
    return next(e);
  }
};
