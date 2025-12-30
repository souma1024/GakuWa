import { Request, Response, NextFunction } from "express";
import { articleService } from "../services/articleService";
import { CreateArticleRequest } from "../dtos/articles/requestDtos";
import { CreateArticleResponse, GetArticleResponse, GetArticlesResponse } from "../dtos/articles/responseDtos";
import { sendSuccess } from "../utils/sendSuccess";
import { ApiError } from "../errors/apiError";

export const createArticleController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const request: CreateArticleRequest = req.body;
    const response: CreateArticleResponse = await articleService.createArticle(request);

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
    const status = req.query.status as string;

    const articles: GetArticlesResponse[] = await articleService.getArticlesByStatus(status);

    return sendSuccess(res, articles);
  } catch (e) {
    return next(e)
  }
};

export const getArticleDetailController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError('validation_error', 'id is required')
    }

    const articleId = BigInt(id);
    const article: GetArticleResponse = await articleService.getArticleById(articleId);

    sendSuccess(res, article);
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
    const id = BigInt(req.params.id);

    const article = await articleService.publishArticle(id);

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

    return sendSuccess(res, null);
  } catch (e: any) {
    throw next(e);
  }
};