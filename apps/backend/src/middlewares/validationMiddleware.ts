import { Request, Response, NextFunction } from "express";
import { ZodType, ZodSchema } from "zod";
import { ApiError } from "../errors/apiError";

/**
 * body 用バリデーション（既存・そのまま）
 */
export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ApiError("validation_error", "バリデーションエラー"));
    }

    req.body = result.data;
    next();
  };

/**
 * query 用バリデーション（★修正版）
 */
export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          type: "validation_error",
          message: result.error.issues[0]?.message ?? "Invalid query",
        },
      });
    }

    // ★ req.query は絶対に上書きしない
    // ★ パース済みの値は別プロパティに保持
    (req as any).validatedQuery = result.data;

    next();
  };
