import { prisma } from "../lib/prisma";
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

  async findPublishedArticles(authorId? :bigint) {

    const articles = await prisma.article.findMany({
      where: { 
        status: 'published',
        authorId: authorId
      },
      orderBy: { createdAt: "desc" },
      select: {
        handle: true,
        title: true,
        likesCount: true,
        publishedAt: true,
        author: {
          select: {
            handle: true,
            avatarUrl: true
          }
        },
        articleTags: {
          select: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      },
    });

    return articles;
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
