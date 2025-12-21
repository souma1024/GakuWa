import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma'

export type EmailOtpDto = {
  name: string,
  email: string,
  password_hash: string,
  public_token: string,
  code_hash: string,
  expired_at: Date,
  used_at?: Date,
  attempts: number,
  created_at: Date,
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
        expiresAt: emailOtpDto.expired_at,
        usedAt: emailOtpDto.used_at,
        attempts: emailOtpDto.attempts,
        createdAt: emailOtpDto.created_at
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

  async disableOtp(db: Prisma.TransactionClient, email: string) {
    return await db.emailOtp.update({
      data: {
        usedAt: new Date,
      },
      where :{
        email: email,
      }
    })
  }
}