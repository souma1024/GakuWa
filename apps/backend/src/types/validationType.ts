import { z } from 'zod';

const allowedNamePattern = /^[\p{L}\p{N}\s._-]+$/u;

export const signupFormSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { error: "ユーザ名は必須です" })
    .max(30, { error: "30文字以内で入力してください"})
    .regex(allowedNamePattern, { error: "使用できない文字が含まれています（絵文字・特殊記号は不可）" }),
  email: z
    .email({ error: "メールアドレスの形式が不正です" })
    .trim()
    .min(1, { error: "メールアドレスは必須です" })
    .refine(v => v.endsWith(".ac.jp"), 
      { error: "ac.jp ドメインのメールアドレスのみ使用できます"},
    ),
  password: z
    .string()
    .trim()
    .min(8, { error: "8文字以上にしてください" })
    .refine((v) => /[A-Za-z]/.test(v), 
      { error: "英字を1文字以上含めてください" },
    )
    .refine((v) => /[0-9]/.test(v), 
      { error: "数字を1文字以上含めてください"} ,
    )
    .refine((v) => /[!@#$%^&*-]/.test(v),
      { error: "記号（!@#$%^&-*）を1文字以上含めてください" },
    ),
  agreement: z.boolean().refine((v) => v === true, {
    error: "利用規約に同意してください",
  }),
});

export const loginFormSchema = z.object({
  email: signupFormSchema.shape.email,
  password: signupFormSchema.shape.password
});

export const otpVerifySchema = z.object({
  public_token: z.string().trim().length(36, { error: "トークンが不正です" }),
  otp: z
  .string()
  .trim()
  .length(6, { error: "OTPは6桁で入力してください" })
  .regex(/^\d{6}$/, { error: "OTPは6桁の数字のみで入力してください" }),
});


export type signupData = z.infer<typeof signupFormSchema>;
export type loginData = z.infer<typeof loginFormSchema>;
export type otpData = z.infer<typeof otpVerifySchema>;