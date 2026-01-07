import { prisma } from "../lib/prisma";
import { CreateArticleInput, UpdateArticleInput } from "../types/articleSchema";

export const articleRepository = {
  async create(data: CreateArticleInput) {
    const { title, content, categoryId } = data;

    return await prisma.article.create({
      data: {
        title,
        content,
        status: "draft",
        categories: {
          connect: {
            id: BigInt(categoryId), // ← ここが重要
          },
        },
      },
    });
  },

  async findArticlesByStatus(status: string) {
    return await prisma.article.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: bigint) {
    return await prisma.article.findUnique({
      where: { id },
    });
  },

  async updateById(id: bigint, data: UpdateArticleInput) {
    return await prisma.article.update({
      where: { id },
      data,
    });
  },

  async publishById(id: bigint) {
    return await prisma.article.update({
      where: { id },
      data: { status: "published" },
    });
  },

  async deleteById(id: bigint) {
  try {
    return await prisma.article.delete({
      where: { id },
    });
  } catch (e: any) {
    if (e.code === "P2025") {
      return null; // ← ここが重要
    }
    throw e;
  }
},
};
