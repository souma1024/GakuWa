import { Request, Response, NextFunction } from "express"
import { userService } from "../services/userService";
import { ApiError } from "../errors/apiError";
import { sendSuccess } from "../utils/sendSuccess";

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userId = req.userId;
    if (!userId) {
      throw new ApiError("authentication_error", "ブラウザにセッション情報が存在しません");
    }
    const sessionToken: string = req.cookies.session_id;
    await userService.logout(userId, sessionToken);
    
    res.clearCookie('session_id');
    sendSuccess(res, null);
  } catch (e) {
    next(e);  
  }
}