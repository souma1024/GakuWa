import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const suggestController = async (req: Request, res: Response) => {
  const { type, keyword, limit } = (req as any).validatedQuery;

  try {
    if (type === "category") {
      const categories = await prisma.category.findMany({
        where: {
          name: { contains: keyword },
        },
        orderBy: { name: "asc" },
        take: limit,
        select: { id: true, name: true },
      });

      return res.json({
        success: true,
        data: categories.map((c) => ({
          id: String(c.id),
          name: c.name,
        })),
      });
    }

    if (type === "tag") {
      const tags = await prisma.tag.findMany({
        where: {
          name: { contains: keyword },
        },
        orderBy: { name: "asc" },
        take: limit,
        select: { id: true, name: true },
      });

      return res.json({
        success: true,
        data: tags.map((t) => ({
          id: String(t.id),
          name: t.name,
        })),
      });
    }

    return res.status(400).json({
      success: false,
      error: { type: "validation_error", message: "type が不正です" },
    });
  } catch (e) {
    console.error("Suggest API Error:", e); // ★ ログ明示
    return res.status(500).json({
      success: false,
      error: { type: "server_error", message: "Internal Server Error" },
    });
  }
};
