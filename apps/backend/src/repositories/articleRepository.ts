import { prisma } from "../lib/prisma";
import { CreateArticleInput } from "../types/articleSchema";
import { UpdateArticleInput } from "../types/articleSchema";

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
  async findById(id: bigint) {
    return prisma.article.findUnique({
      where: { id },
    });
  },
  async updateById(id: bigint, data: UpdateArticleInput) {
    return prisma.article.update({
      where: { id },
      data,
    });
  },
};
