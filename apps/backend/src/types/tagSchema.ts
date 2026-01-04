import { z } from "zod";

/**
 * タグ作成（ユーザー）
 */
export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "タグ名は必須です")
    .max(30, "タグ名は30文字以内で入力してください"),
});

/**
 * タグ更新（管理者）
 */
export const updateTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "タグ名は必須です")
    .max(30, "タグ名は30文字以内で入力してください"),
});
