import { prisma } from "../lib/prisma";
import { ArticleStatus } from '@prisma/client';
import { CreateArticleInput, UpdateArticleInput } from "../types/articleSchema";

export const articleRepository = {
  async create(data: CreateArticleInput, authorId: bigint, handle: string) {
    const { title, content, categoryId } = data;

    return await prisma.article.create({
      data: {
        title,
        handle: handle,
        contentMd: content,
        contentHtml: content,
        status: "draft",
        author:   { connect: { id: authorId } },
        category: { connect: { id: BigInt(categoryId) },
        },
      },
    });
  },

  async findArticlesByStatus(status: string) {
    const statusEnum: ArticleStatus = status as ArticleStatus; 
    return await prisma.article.findMany({
      where: { status: statusEnum },
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
