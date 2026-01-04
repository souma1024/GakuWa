import { Request, Response, NextFunction } from "express";
import { tagService } from "../services/tagService";
import { sendSuccess } from "../utils/sendSuccess";

export const tagController = {
  /**
   * タグ作成（ユーザー）
   * POST /api/tags
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const tag = await tagService.findOrCreate(name);

      sendSuccess(res, tag);
    } catch (err) {
      next(err);
    }
  },

  /**
   * タグ更新（管理者）
   * PUT /api/admin/tags/:tagId
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const tagId = Number(req.params.tagId);
      const { name } = req.body;

      const tag = await tagService.update(tagId, name);

      sendSuccess(res, tag);
    } catch (err) {
      next(err);
    }
  },
};
