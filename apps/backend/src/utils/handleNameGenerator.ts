import { prisma } from '../lib/prisma'

export async function generateUniqueHandle(baseName: string): Promise<string> {
  let handle = `${baseName}`;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { handle: handle },
    });

    // 同じ人が存在しない場合
    if (!existingUser) {
      isUnique = true;
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      handle = `${baseName}${randomSuffix}`;
    }
  }

  return handle;
}