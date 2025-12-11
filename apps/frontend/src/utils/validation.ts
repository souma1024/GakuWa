import { z } from "zod";

const allowedNamePattern = /^[\p{L}\p{N}\s._-]+$/u;

export const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .nonempty('ユーザ名の入力してください')
    .min(1, "ユーザ名は必須です")
    .max(30, "30文字以内で入力してください")
    .regex(allowedNamePattern, "使用できない文字が含まれています（絵文字・特殊記号は不可）"),

  email: z
    .string()
    .trim()
    .min(1, "メールアドレスは必須です")
    .email("メールアドレスの形式が不正です")
    .refine(v => v.endsWith(".ac.jp"), {
      message: "ac.jp ドメインのメールアドレスのみ使用できます",
    }),

  password: z
    .string()
    .trim()
    .min(8, "8文字以上にしてください")
    .refine((v) => /[A-Za-z]/.test(v), {
    message: "英字を1文字以上含めてください",
    })
    .refine((v) => /[0-9]/.test(v), {
      message: "数字を1文字以上含めてください",
    })
    .refine((v) => /[!@#$%^&*-]/.test(v), {
      message: "記号（!@#$%^&-*）を1文字以上含めてください",
    }),

  agreement: z
    .boolean()
    .refine(v => v === true, {
    message: "利用規約に同意してください",
  }),
});

export type SignupValues = z.infer<typeof signupSchema>;