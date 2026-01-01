import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "タグを選択してください")
    .max(30, "タグ名は30文字以内で入力してください")
});