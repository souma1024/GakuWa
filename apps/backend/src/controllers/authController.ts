import { Request, Response } from "express";
import { authService } from "../services/authService";
import { sendSuccess } from "../utils/response";

/**
 * POST /login
 * ※ 実際のルーティングは routes/auth.ts 側で行う想定
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { sessionToken, expiresAt } = await authService.login(
    email,
    password
  );

  res.cookie("session_id", sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });

  return sendSuccess(res);
};
