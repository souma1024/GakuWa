import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma'

export const userRepository = {

  // 新規登録関数
  async registerUser(db: Prisma.TransactionClient, name: string, handle: string, email: string, passwordHash: string) {
    return await db.user.create({
      data: {
        name: name,
        handle: handle,
        email: email,
        passwordHash: passwordHash,
        status: 'active'
      },
    });
  },

  async findById(id: bigint) {
    return await prisma.user.findUnique({
      where: {
        id: id
      }
    });
  },

  async findByEmailPassword(email: string, passwordHash: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
        passwordHash: passwordHash
      },
    });
  },

  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  },

  async findByHandle(handle: string) {
    return  await prisma.user.findFirst({
      where: {
        handle,
      }
    })
  },

  // 取得件数, id並び順, 取得初めの位置を指定してuserを返す関数
  async getUsers(take: number, orderBy: 'desc' | 'asc', skip: number) {
    return await prisma.user.findMany({
      take: take,
      skip: skip,
      orderBy: {
        id: orderBy
      },
    })
  }
}