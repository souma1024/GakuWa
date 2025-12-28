import { prisma } from "../lib/prisma";
import { CreateArticleInput } from "../types/articleSchema";

export const articleRepository = {
  async create(data: CreateArticleInput) {
    return prisma.article.create({
      data,
    });
  },
};
