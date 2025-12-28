import { prisma } from "../lib/prisma";
import { CreateArticleInput } from "../types/articleSchema";

export const articleRepository = {
  async create(data: CreateArticleInput) {
    return prisma.article.create({
      data,
    });
  },
  async findByStatus(status: string) {
    return prisma.article.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  },
};
