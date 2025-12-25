import nodemailer from 'nodemailer'
import { ApiError } from '../errors/apiError'


export const emailService = {
  async sendVerificationEmail(email: string, otp: string): Promise<void> {

    const transporter = await nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false,
    })

    if (!transporter) {
      throw new ApiError('external_service_error', 'メールサーバに問題があります');
    }

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'GakuWa運営チームワンタイムパスワードの認証',
      text: `あなたのワンタイムパスワードは ${otp} です。\n15分以内に入力してください。`,
    });
  }
}