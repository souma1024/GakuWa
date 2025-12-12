import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}