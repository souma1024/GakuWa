import { z } from "zod";

<<<<<<< HEAD
<<<<<<< HEAD
/**
 * タグ作成（ユーザー）
 */
=======
>>>>>>> d33e5e8 (タグ作成機能完成)
=======
// 作成用（ユーザー）
>>>>>>> 40e8e76 (tag修正)
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
<<<<<<< HEAD
    .max(30, "タグ名は30文字以内で入力してください")
});
>>>>>>> d33e5e8 (タグ作成機能完成)
=======
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
>>>>>>> 40e8e76 (tag修正)
