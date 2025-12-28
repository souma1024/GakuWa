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

export const updateArticleController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = BigInt(req.params.id);

    const article = await articleService.updateArticle(id, req.body);

    return res.json({
      success: true,
      data: {
        id: article.id.toString(),
        title: article.title,
        content: article.content,
        status: article.status,
        updatedAt: article.updatedAt,
      },
    });
  } catch (err: any) {
    // Prisma: レコードが存在しない場合
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: {
          type: "not_found",
          message: "article not found",
        },
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        type: "internal_error",
        message: "failed to update article",
      },
    });
  }
};

export const publishArticleController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = BigInt(req.params.id);

    const article = await articleService.publishArticle(id);

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
        id: article.id.toString(),
        status: article.status,
        updatedAt: article.updatedAt,
      },
    });
  } catch (err: any) {
    if (err.message === "already_published") {
      return res.status(400).json({
        success: false,
        error: {
          type: "invalid_state",
          message: "article is already published",
        },
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        type: "internal_error",
        message: "failed to publish article",
      },
    });
  }
};
