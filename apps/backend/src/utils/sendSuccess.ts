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

  // ★ BigInt を安全に number に変換してから返す
  return res.status(status).json(
    JSON.parse(
      JSON.stringify(body, (_, value) =>
        typeof value === "bigint" ? Number(value) : value
      )
    )
  );
}
