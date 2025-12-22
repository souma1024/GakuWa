import { Response } from "express";
import { ApiSuccessResponse } from "../types/apiResponseTypes";

// ------------------------------
// 成功レスポンス
// ------------------------------
export function sendSuccess<T>(
  res: Response,
  data: T,
  status = 200
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(status).json(body);
}