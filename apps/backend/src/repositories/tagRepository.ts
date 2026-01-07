import { prisma } from "../lib/prisma";

export const tagRepository = {
  findByName(name: string) {
    return prisma.tag.findUnique({
      where: { name },
    });
  },

  create(name: string) {
    return prisma.tag.create({
      data: { name },
    });
  },
};
