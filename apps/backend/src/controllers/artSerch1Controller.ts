import { Request, Response, NextFunction } from 'express';
import { articleService } from '../services/artSerch1Service';

export const searchArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // クエリパラメータの受け取り
    const keyword = (req.query.q as string) || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    // Service実行
    const result = await articleService.searchArticles(keyword, page, limit);

    // レスポンス返却
    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};