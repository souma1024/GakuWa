const mailer = require('nodemailer');

const smtp = mailer.createTransport({
  host: process.env.SMTP_HOST || "mailhog", // ← ここ
  port: Number(process.env.SMTP_PORT) || 1025,
});

const mailOptions = {
  from: 'hoge@github.com',
  to: 'hogehoge@github.com',
  subject: 'タイトルです',
  html: 'メール本文です',
};

module.exports = {
    smtp,
    mailOptions,
};