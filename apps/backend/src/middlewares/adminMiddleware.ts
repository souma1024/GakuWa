import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/apiError";

export const adminOnly = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    throw new ApiError("forbidden", "管理者権限が必要です");
  }
  return next();
};
