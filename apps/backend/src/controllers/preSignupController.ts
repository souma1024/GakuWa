import { Request, Response, NextFunction } from "express";
import { userService } from "../services/userService";
import { sendSuccess } from "../utils/sendSuccess";


export const preSignupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password} = req.body;
    const public_token = await userService.preSignup(name, email, password);

    sendSuccess(res, { public_token: public_token});
  } catch(e) {
    next(e);
  }
}