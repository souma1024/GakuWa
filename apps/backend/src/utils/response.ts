import { Response } from "express";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ValidationErrorFields,
  ValidationErrorType,
  AuthErrorType,
  ResourceErrorType,
  ServerErrorType,
  NonValidationErrorResponse,
} from "../types/responseType";

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

// ------------------------------
// バリデーションエラー
// ------------------------------
export function sendValidationError(
  res: Response,
  type: ValidationErrorType,        // ← validation 系だけ
  message: string,
  fields: ValidationErrorFields,
  status = 400
) {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      type,
      message,
      fields,
    },
  };
  return res.status(status).json(body);
}

// ------------------------------
// その他のエラー（認証・リソース・サーバ系）
// ------------------------------
export function sendError(
  res: Response,
  type: AuthErrorType | ResourceErrorType | ServerErrorType, 
  message: string,
  status: number
) {
  const body: NonValidationErrorResponse = {
    success: false,
    error: {
      type,
      message,
    },
  };
  return res.status(status).json(body);
}