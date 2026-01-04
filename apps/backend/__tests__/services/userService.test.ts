import bcrypt from "bcrypt";
import { prisma } from "../../src/lib/prisma";
import { ApiError } from "../../src/errors/apiError";

/**
 * userService
 * - ログイン処理
 * - セッション作成
 */
export const userService = {
  /**
   * ログイン
   */
  async login(email: string, password: string) {
    // ① 入力チェック
    if (!email || !password) {
      throw new ApiError("validation_error", "メールアドレスとパスワードは必須です");
    }

    // ② ユーザー取得
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(
  "invalid_credentials",
  "メールアドレスまたはパスワードが正しくありません"
);
    }

    // ③ パスワード検証
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new ApiError("invalid_credentials", "メールアドレスまたはパスワードが正しくありません");
    }

    // ④ セッショントークン生成
    const sessionToken = cryptoRandomString();

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24時間

    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken,
        expiresAt,
      },
    });

    // ⑤ レスポンス用ユーザー情報整形
    return {
      sessionToken,
      user: {
        id: Number(user.id),
        handle: user.handle,
        name: user.name,
        avatarUrl: user.avatarUrl,
        profile: user.profile,
        followersCount: user.followersCount,
        followingsCount: user.followingsCount,
        role: user.role,
      },
    };
  },
};

/**
 * ランダムなセッショントークン生成
 */
function cryptoRandomString(): string {
  return require("crypto").randomBytes(32).toString("hex");
}
