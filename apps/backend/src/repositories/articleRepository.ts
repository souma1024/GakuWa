import { prisma } from "../lib/prisma";
import { CreateArticleInput, UpdateArticleInput } from "../types/articleSchema";

export const articleRepository = {
  async create(data: CreateArticleInput) {
    const { title, content, categoryId } = data;

    return prisma.article.create({
      data: {
        title,
        content,
        status: "draft",
        category: {
          connect: {
            id: BigInt(categoryId), // ← ここが重要
          },
        },
      },
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

  async publishById(id: bigint) {
    return prisma.article.update({
      where: { id },
      data: { status: "published" },
    });
  },

  async deleteById(id: bigint) {
    return prisma.article.delete({
      where: { id },
    });
  },
};
