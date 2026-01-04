import { Request, Response, NextFunction } from "express";
import { tagService } from "../services/tagService";
import { sendSuccess } from "../utils/sendSuccess";

export const createTagController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const tag = await tagService.createTag(name);

    sendSuccess(res, tag);
  } catch (err) {
    next(err);
  }
};
