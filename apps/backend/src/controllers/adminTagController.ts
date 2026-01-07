import { Request, Response, NextFunction } from "express";
import { adminTagService } from "../services/adminTagService";
import { sendSuccess } from "../utils/sendSuccess";

export const updateTagController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagId = Number(req.params.tagId);
    const { name } = req.body;

    const updated = await adminTagService.updateTag(tagId, name);
    sendSuccess(res, updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTagController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const tagId = Number(req.params.tagId);

    await adminTagService.deleteTag(tagId);
    sendSuccess(res, { message: "タグを削除しました" });
  } catch (err) {
    next(err);
  }
};
