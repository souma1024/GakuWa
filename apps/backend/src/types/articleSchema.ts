import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().max(255),
  content: z.string().max(65535),
  status: z.literal("draft"),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
