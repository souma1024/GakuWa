import { Request, Response, NextFunction } from "express";
import { adminTagService } from "../services/adminTagService";
import { sendSuccess } from "../utils/sendSuccess";

export const deleteTagController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagId = Number(req.params.tagId);

    await adminTagService.deleteTag(tagId);

    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
};
