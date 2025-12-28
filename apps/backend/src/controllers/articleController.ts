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
    console.error("❌ createArticle error:", err);
    return res.status(500).json({
      success: false,
      error: {
        type: "internal_error",
        message: "failed to create article",
      },
    });
  }
};
