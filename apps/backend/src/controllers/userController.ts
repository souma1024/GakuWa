import { Request, Response } from "express";
import { registerUser } from "../services/userEntry";

export const userController = async (req: Request, res: Response) => {
    try {
        // リクエストボディを受け取る
        const { email, otpId, desiredName } = req.body;
    
        // バリデーション（簡易）
        if (!email || !otpId) {
          res.status(400).json({ 
            success: false, 
            error: { message: 'emailとotpIdは必須です' } 
          });
          return; // 必ずreturnして処理を終了させる
        }
    
        // 先ほどのロジックを呼び出し
        const result = await registerUser({ email, otpId, desiredName });
    
        if (result.success) {
          res.status(201).json(result);
        } else {
          res.status(400).json(result);
        }
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
 }