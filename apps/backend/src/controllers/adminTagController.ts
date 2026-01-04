<<<<<<< HEAD
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
=======
import { Request, Response, NextFunction } from "express";
>>>>>>> 40e8e76 (tag修正)
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

    // ★ 決定打：data を渡す
    sendSuccess(res, null);
  } catch (err) {
    next(err);
  }
<<<<<<< HEAD

  await adminTagService.deleteTag(tagId);

  return res.status(200).json({
    success: true,
  });
>>>>>>> 0adcb1a (タグ削除完成)
=======
>>>>>>> 40e8e76 (tag修正)
};
