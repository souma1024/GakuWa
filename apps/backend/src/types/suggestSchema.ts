import { z } from "zod";

export const suggestQuerySchema = z.object({
  type: z.enum(["tag", "category"], {
    message: "type は tag または category を指定してください",
  }),

  keyword: z
    .string({ message: "keyword は string を指定してください" })
    .trim()
    .min(1, { message: "文字を入力してください" })
    .max(50, { message: "keyword は 50 文字以内にしてください" }),

  // req.query は string | string[] | undefined なので前処理する
  limit: z
    .preprocess((v) => {
      if (v === undefined || v === null || v === "") return 5;
      if (Array.isArray(v)) return v[0];
      const n = Number(v);
      return Number.isFinite(n) ? n : v; // numberにならない場合は後段で弾く
    }, z.number().int().min(1).max(5))
    .optional(),
});

export type SuggestQuery = z.infer<typeof suggestQuerySchema>;
