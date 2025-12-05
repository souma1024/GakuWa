import { Request, Response, NextFunction } from "express";
import { sessionRepository } from "../repositories/sessionRepository";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.session_id;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  const session = await sessionRepository.findValidSessionByToken(token);
  if (!session) return res.status(401).json({ error: "Invalid session" });

  next();
};