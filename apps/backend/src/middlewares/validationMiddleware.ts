import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

import { ApiError } from "../errors/apiError";

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log("失敗");
      return next(new ApiError('validation_error', 'バリデーションエラー'));
    }
    console.log("成功");
    req.body = result.data;
    return next();
  };