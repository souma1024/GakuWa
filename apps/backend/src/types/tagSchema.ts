import { z } from "zod";

<<<<<<< HEAD
/**
 * タグ作成（ユーザー）
 */
=======
>>>>>>> d33e5e8 (タグ作成機能完成)
export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
<<<<<<< HEAD
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
=======
    .min(1, "タグを選択してください")
    .max(30, "タグ名は30文字以内で入力してください")
});
>>>>>>> d33e5e8 (タグ作成機能完成)
