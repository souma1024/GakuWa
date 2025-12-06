import express from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows]: any = await pool.execute(
      "SELECT handle, password_hash FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          type: "auth_error",
          message: "メールアドレスまたはパスワードが異なります",
          fields: ["email", "password"]
        }
      });
    }

    const user = rows[0];

    // ✅ bcryptjs で照合（同期版を使用してネイティブビルド不要にする）
    const isMatch = bcrypt.compareSync(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          type: "auth_error",
          message: "メールアドレスまたはパスワードが異なります",
          fields: ["email", "password"]
        }
      });
    }

    // ✅ ログイン成功
    return res.json({
      success: true,
      data: {
        handle: user.handle
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: {
        type: "server_error",
        message: "サーバーエラーが発生しました"
      }
    });
  }
});

export default router;
