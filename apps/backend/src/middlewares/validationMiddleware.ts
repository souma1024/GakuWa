import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import { sendValidationError } from "../utils/response";

export const validateBody =
  <T>(schema: ZodType<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.log("失敗");
      return sendValidationError(
        res,
        "validation_error",
        "入力項目が不正です",
        {},
        400
      );
    }
    console.log("成功");
    req.body = result.data;
    return next();
  };