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

    // tagService 側の関数名ゆれに対応
    const tag =
      "findOrCreateTag" in tagService
        ? await (tagService as any).findOrCreateTag(name)
        : await (tagService as any).findOrCreate(name);

    sendSuccess(res, tag);
  } catch (err) {
    next(err);
  }
};
