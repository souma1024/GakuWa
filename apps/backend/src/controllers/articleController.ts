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
