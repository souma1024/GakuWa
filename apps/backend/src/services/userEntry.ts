import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface RegisterRequest {
  email: string;
  otpId: number;
  desiredName?: string;
}

async function generateUniqueHandle(baseName: string): Promise<string> {
  let handle = `@${baseName}`;
  let isUnique = false;

  while (!isUnique) {
    const existingUser = await prisma.user.findUnique({
      where: { handle: handle },
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      handle = `@${baseName}${randomSuffix}`;
    }
  }

  return handle;
}

export const registerUser = async (reqBody: RegisterRequest) => {
  const { email, otpId, desiredName } = reqBody;

  const baseName = desiredName || email.split('@')[0];

  const uniqueHandle = await generateUniqueHandle(baseName);

  try {
    const result = await prisma.$transaction(async (tx:any) => {
      const newUser = await tx.user.create({
        data: {
          email: email,
          handle: uniqueHandle,
          name: baseName,
        },
      });

      await tx.emailOtp.update({
        where: { id: otpId },
        data: {
          used_at: new Date(),
        },
      });

      return newUser;
    });

    console.log('本登録成功:', result);

    return {
      success: true,
      data: {
        handle: result.handle
      }
    };

  } catch (error) {
    console.error('本登録失敗:', error);
    return {
      success: false,
      error: {
        type: 'registration_error',
        message: 'ユーザー登録に失敗しました。',
      }
    };
  }
};