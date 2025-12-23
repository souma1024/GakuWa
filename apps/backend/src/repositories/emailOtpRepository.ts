import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma'

export type EmailOtpDto = {
  name: string,
  email: string,
  password_hash: string,
  public_token: string,
  code_hash: string,
  used_at?: Date,
  expires_at: Date
}

export const emailOtpRepository = {
  async registerEmailOtp(emailOtpDto: EmailOtpDto) {
    return await prisma.emailOtp.create({
      data: {
        name: emailOtpDto.name,
        email: emailOtpDto.email,
        passwordHash: emailOtpDto.password_hash,
        publicToken: emailOtpDto.public_token,
        codeHash: emailOtpDto.code_hash,
        usedAt: emailOtpDto.used_at,
        expiresAt: emailOtpDto.expires_at
      },
    });
  },

  async changeOtp(public_token: string, code_hash: string, attempts: number, expired_at: Date) {
    return await prisma.emailOtp.updateMany({
      data: {
        codeHash: code_hash,
        attempts: attempts,
        expiresAt: expired_at
      },
      where: {
        publicToken: public_token
      }
    });
  },

  async disableOtp(db: Prisma.TransactionClient, public_token: string) {
    return await db.emailOtp.update({
      data: {
        usedAt: new Date,
      },
      where :{
        publicToken: public_token,
      }
    })
  }
}