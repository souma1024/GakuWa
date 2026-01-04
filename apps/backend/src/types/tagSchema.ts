import { z } from "zod";

// 作成用（ユーザー）
export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "タグを選択してください")
    .max(30, "タグ名は30文字以内で入力してください"),
});

// 更新用（管理者）※作成と同じバリデーションでOK
export const updateTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "タグを選択してください")
    .max(30, "タグ名は30文字以内で入力してください"),
});
