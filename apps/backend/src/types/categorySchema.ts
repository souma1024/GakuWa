import { z } from "zod";

// 禁止文字: / \ : * ? " < > | @ & # $ % = + ` '
const forbiddenCharsRegex = /[\/\\:\*\?"<>\|@&#\$%=\+`']/;

export const categoryNameSchema = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v.length >= 1, { message: "カテゴリ名を入力してください" })
  .refine((v) => v.length <= 50, { message: "カテゴリ名は50文字以内で入力してください" })
  .refine((v) => !forbiddenCharsRegex.test(v), {
    message: "使用できない記号が含まれています",
  });

export const createCategorySchema = z.object({
  name: categoryNameSchema,
});

export const updateCategorySchema = z.object({
  name: categoryNameSchema,
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
