import { NextFunction, Request, Response } from "express";
import { Posts } from "../dtos/rankings/postsRanking";
import { rankingService } from "../services/rankingService";
import { sendSuccess } from "../utils/sendSuccess";

export const rankingController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mode = req.params;
    const rankings: Posts[] = await rankingService.postsArticle();

    sendSuccess(res, rankings);
  } catch(e) {
    next(e);
  }
} 