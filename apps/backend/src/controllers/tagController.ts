import { Request, Response, NextFunction } from "express";
import { tagService } from "../services/tagService";
import { sendSuccess } from "../utils/sendSuccess";

/**
 * タグ作成（ユーザー）
 * POST /api/tags
 */
export const createTagController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const tag = await tagService.findOrCreateTag(name);

    sendSuccess(res, tag);
  } catch (err) {
    next(err);
  }
};
