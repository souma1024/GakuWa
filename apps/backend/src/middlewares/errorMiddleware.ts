import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/apiError";

// next(args) next関数が引数ありで呼び出されるとこの関数が実行される。
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ApiError) {
    const body =
      err.fields
        ? { success: false, error: {status:err.status, type: err.type, message: err.message, fields: err.fields } }
        : { success: false, error: {status:err.status, type: err.type, message: err.message } };

    return res.status(err.status).json(body);
  } 

  // 異常エラー
  console.error(err);
  return res.status(500).json({
    success: false,
    error: { type: "server_error", message: "Internal Server Error" },
  });
};