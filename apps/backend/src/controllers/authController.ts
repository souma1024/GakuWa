import { Request, Response } from "express";

import { authService } from "../services/authService";

export const login = async (req: Request, res: Response) => {
  const { sessionToken, expiresAt } = await authService.login(
    req.body.email,
    req.body.password
  );

  res.cookie("session_id", sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
  });

  return res.json({ success: "true" });
};