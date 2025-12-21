import { NextFunction, Request, Response } from "express";

import { sendSuccess } from '../utils/sendSuccess'
import { userService } from "../services/userService";


export const signupController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // /signupから入力情報を受け取る
        const { name, email, password } = req.body;
        
        const user = userService.signup(name, email, password);
        
        return sendSuccess(res, user);
      } catch (e) {
        return next(e);
      }
}