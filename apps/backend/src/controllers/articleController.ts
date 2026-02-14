import { Request, Response, NextFunction } from "express";
import { articleService } from "../services/articleService";
import { CreateArticleRequest } from "../dtos/articles/requestDtos";
import { sendSuccess } from "../utils/sendSuccess";
import { ApiError } from "../errors/apiError";

export const createArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request: CreateArticleRequest = req.body;
    const userId = req?.userId;
    if (!userId) {
      throw new ApiError('authentication_error', 'セッション情報が保存されていません');
    }
    const response = await articleService.createArticle(request, userId);

    return sendSuccess(res, response);
  } catch (e) {
    return next(e);
  }
};


export const getArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const articles = await articleService.getPublishedArticles();

    return sendSuccess(res, articles);
  } catch (e) {
    return next(e)
  }
};

export const getUsersArticlesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId;
    const type = req.query.t;

    if (!userId) {
      throw new ApiError('authentication_error', 'セッション情報が保存されていません');
    }

    const articles = type
      ? await articleService.getAllArticlesById(userId)
      : await articleService.getPublishedArticles(userId);
    

    return sendSuccess(res, articles);
  } catch(e) {
    next(e);
  }
}

export const getArticleDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { handle } = req.params;

    if (!handle) {
      throw new ApiError('validation_error', '記事のキーがありません')
    }

    const article = await articleService.getArticleByHandle(handle);

    return sendSuccess(res, article);
  } catch (e) {
    return next(e);
  }
};


export const updateArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = BigInt(req.params.id);

    const updatedArticle = await articleService.updateArticle(id, req.body);

    return sendSuccess(res, updatedArticle);
  } catch (e: any) {
    return next(e);
  }
};

export const publishArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const handle = req.body.handle;

    console.log("handle", handle);

    if (!handle) {
      throw new ApiError('forbidden', '記事のハンドル名取得に失敗しました');
    }

    const article = await articleService.publishArticle(handle);

    return sendSuccess(res, article);
  } catch (e: any) {
    return next(e);
  }
};

export const deleteArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = BigInt(req.params.id);

    await articleService.deleteArticle(id);

    return res.sendStatus(204);
  } catch (e: any) {
    return next(e);
  }
};