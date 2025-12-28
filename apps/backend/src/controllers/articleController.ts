import { Request, Response } from "express";
import { articleService } from "../services/articleService";

export const createArticleController = async (
  req: Request,
  res: Response
) => {
  try {
    const article = await articleService.createArticle(req.body);

    return res.json({
      success: true,
      data: {
        id: article.id.toString(),
        title: article.title,
        status: article.status,
        createdAt: article.createdAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        type: "internal_error",
        message: "failed to create article",
      },
    });
  }
};

// ★ これを必ず export する
export const getArticlesController = async (
  req: Request,
  res: Response
) => {
  try {
    const status = req.query.status as string;

    const articles = await articleService.getArticlesByStatus(status);

    return res.json({
      success: true,
      data: articles.map((a) => ({
        id: a.id.toString(),
        title: a.title,
        status: a.status,
        createdAt: a.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        type: "internal_error",
        message: "failed to fetch articles",
      },
    });
  }
};

export const getArticleDetailController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = BigInt(req.params.id);

    const article = await articleService.getArticleById(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: {
          type: "not_found",
          message: "article not found",
        },
      });
    }

    return res.json({
      success: true,
      data: {
        id: article.id.toString(), // BigInt対策
        title: article.title,
        content: article.content,
        status: article.status,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        type: "internal_error",
        message: "failed to fetch article",
      },
    });
  }
};
