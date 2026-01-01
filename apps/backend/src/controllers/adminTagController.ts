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
};
