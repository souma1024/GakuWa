import { prisma } from "../lib/prisma";

export const categoryRepository = {
  findAll: async () => {
    return prisma.category.findMany({
      orderBy: { id: "asc" },
    });
  },

  findById: async (id: bigint) => {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  findByName: async (name: string) => {
    return prisma.category.findFirst({
      where: { name },
    });
  },

  create: async (name: string) => {
    return prisma.category.create({
      data: { name },
    });
  },

  updateName: async (id: bigint, name: string) => {
    return prisma.category.update({
      where: { id },
      data: { name },
    });
  },

  delete: async (id: bigint) => {
    return prisma.category.delete({
      where: { id },
    });
  },

  // もし「使用中カテゴリは削除不可」にしたい場合に使う（Articleがある前提）
  countArticlesByCategoryId: async (id: bigint) => {
    // あなたの schema に Article が無い場合は、この関数は呼ばないでOK
    // model Article { categoryId BigInt ... } がある前提
    return prisma.article.count({
      where: { categoryId: id },
    });
  },
};
