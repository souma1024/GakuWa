import { Response } from "express";

export function setCookie(res: Response, sessionToken: string) {
  res.cookie("session_id", sessionToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}