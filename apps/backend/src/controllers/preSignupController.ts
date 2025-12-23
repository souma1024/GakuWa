import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { sendSuccess } from "../utils/sendSuccess";
import { PreSignupRequest } from "../dtos/users/requestDto";


export const preSignupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request: PreSignupRequest = req.body;
    const public_token = await userService.preSignup(request);

    sendSuccess(res, { public_token: public_token});
  } catch(e) {
    next(e);
  }
}