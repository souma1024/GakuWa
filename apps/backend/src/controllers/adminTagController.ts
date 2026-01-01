<<<<<<< HEAD
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
=======
import { Request, Response } from "express";
import { adminTagService } from "../services/adminTagService";

export const deleteTagController = async (req: Request, res: Response) => {
  const tagId = Number(req.params.tagId);

  // バリデーション
  if (Number.isNaN(tagId)) {
    return res.status(400).json({
      success: false,
      error: {
        type: "validation_error",
        message: "タグIDが不正です",
      },
    });
  }

  await adminTagService.deleteTag(tagId);

  return res.status(200).json({
    success: true,
  });
>>>>>>> 0adcb1a (タグ削除完成)
};
