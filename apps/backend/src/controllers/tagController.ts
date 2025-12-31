import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * タグ作成（既存があればそれを返す）
 * POST /api/tags
 */
export const createTagController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.body;

    // ===== ① バリデーション =====

    // 型チェック
    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        error: {
          message: "タグ名は文字列で入力してください",
        },
      });
    }

    // 前後の空白を除去
    const trimmedName = name.trim();

    // 空文字チェック
    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        error: {
          message: "タグを選択してください",
        },
      });
    }

    // 文字数チェック
    if (trimmedName.length > 30) {
      return res.status(400).json({
        success: false,
        error: {
          message: "タグ名は30文字以内で入力してください",
        },
      });
    }

    // ===== ② 既存タグ確認 =====
    const existingTag = await prisma.tag.findUnique({
      where: {
        name: trimmedName,
      },
    });

    if (existingTag) {
      // 既存タグがあればそのまま返す
      return res.status(200).json({
        success: true,
        data: existingTag,
      });
    }

    // ===== ③ 新規作成 =====
    const newTag = await prisma.tag.create({
      data: {
        name: trimmedName,
      },
    });

    return res.status(201).json({
      success: true,
      data: newTag,
    });

  } catch (error) {
    console.error("createTagController error:", error);

    return res.status(500).json({
      success: false,
      error: {
        message: "サーバーエラーが発生しました",
      },
    });
  }
};


export const updateTagController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("DEBUG role:", req.user?.role);
    // ===== ① 管理者権限チェック =====
    // ※ authenticateUser middleware で req.user が入っている前提
    if (!req.user || req.user.role !== UserRole.admin) {
  return res.status(403).json({
    success: false,
    error: { message: "管理者権限が必要です" },
  });
}

    // ===== ② tagId チェック =====
    const tagId = Number(req.params.tagId);
    if (Number.isNaN(tagId)) {
      return res.status(400).json({
        success: false,
        error: { message: "不正なタグIDです" },
      });
    }

    const { name } = req.body;

    // ===== ③ バリデーション =====
    if (typeof name !== "string") {
      return res.status(400).json({
        success: false,
        error: { message: "タグ名は文字列で入力してください" },
      });
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        error: { message: "タグ名を入力してください" },
      });
    }

    if (trimmedName.length > 30) {
      return res.status(400).json({
        success: false,
        error: { message: "タグ名は30文字以内で入力してください" },
      });
    }

    // ===== ④ 対象タグ存在チェック =====
    const targetTag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!targetTag) {
      return res.status(404).json({
        success: false,
        error: { message: "タグが存在しません" },
      });
    }

    // ===== ⑤ 重複チェック =====
    const duplicatedTag = await prisma.tag.findUnique({
      where: { name: trimmedName },
    });

    if (duplicatedTag && duplicatedTag.id !== tagId) {
      return res.status(400).json({
        success: false,
        error: { message: "同名のタグがすでに存在します" },
      });
    }

    // ===== ⑥ 更新 =====
    const updatedTag = await prisma.tag.update({
      where: { id: tagId },
      data: { name: trimmedName },
    });

    return res.status(200).json({
      success: true,
      data: updatedTag,
    });

  } catch (error) {
    console.error("updateTagController error:", error);

    return res.status(500).json({
      success: false,
      error: { message: "サーバーエラーが発生しました" },
    });
  }
};