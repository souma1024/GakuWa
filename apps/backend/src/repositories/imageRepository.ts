import { prisma } from '../lib/prisma'

export const imageRepository =  {
  async insertAvatarUrl(objectKey: string, handle: string): Promise<string> {
    const user = await prisma.user.update({
      where: {
        handle: handle,
      }, 
      data: {
        avatarUrl: objectKey
      },
      select: {
        avatarUrl: true
      }
    });
    return user.avatarUrl;
  }
}