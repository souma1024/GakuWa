import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'; // パスワードをそのまま保存するのはNG！ハッシュ化するためのライブラリ
import * as crypto from 'crypto'; // ランダムなトークンを作るためのやつ

// DB操作用のクライアント（魔法の杖）を準備
const prisma = new PrismaClient();

// フロントから送られてくるデータの型（これがリクエストの中身！）
interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// フロントに返すデータの型（成功したらトークン、失敗したらエラーメッセージ）
interface SignupResponse {
  success: boolean;
  data?: {
    public_token: string;
  };
  error?: {
    type?: string;
    message: string;
  };
}

/**
 * 6桁の認証コードを作る関数
 * Math.random()を使って、100000〜999999の間でランダムな数字を出します！
 */
function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * メールを送る機能（今はまだモックです！）
 * 本番ではSendGridとかを使う予定だけど、とりあえずコンソールに出して確認します
 */
async function sendVerificationEmail(email: string, code: string) {
  // ここで本当にメールを送る処理を書く予定
  console.log(`[メール送信テスト] 宛先: ${email}, コード: ${code}`);
}

/**
 * これがメインの処理！仮ユーザー登録API (POST /api/auth/signup)
 */
export const signupUser = async (reqBody: SignupRequest): Promise<SignupResponse> => {
  // リクエストから必要なデータを取り出す
  const { name, email, password } = reqBody;

  try {
    // 1. パスワードのハッシュ化
    // 生のパスワードをDBに入れるのはセキュリティ的に絶対ダメらしいので、暗号化します！
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 2. 認証用のコードとトークンを生成
    const otpCode = generateSixDigitCode(); // これはメールでユーザーに送る「数字」
    const publicToken = crypto.randomUUID(); // これは画面側に返す「ランダムな文字列」

    // 3. OTPコードもハッシュ化！
    // もしDBの中身を見られても認証コードがバレないように、こっちもハッシュ化して保存するのが安全らしいです
    const otpHash = await bcrypt.hash(otpCode, 10);

    // 有効期限を設定（とりあえず今から15分後にしてます）
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // 4. DBへの保存（トランザクション処理）
    // 「ユーザー作成」と「OTP作成」はセットじゃないと困るから、片方コケたら全部ナシにするためにトランザクションを使いました！
    await prisma.$transaction(async (tx: any) => {
      
      // A. まずユーザーを仮登録状態で作成
      const newUser = await tx.user.create({
        data: {
          name: name,
          email: email,
          password_hash: passwordHash, // ハッシュ化したパスワードを入れる！
          // 本登録まではログインさせない仕組みが必要かも？
        },
      });

      // B. 次にOTP（ワンタイムパスワード）の情報を保存
      await tx.emailOtp.create({
        data: {
          user_id: newUser.id,      // さっき作ったユーザーのIDと紐付け
          otp_hash: otpHash,        // 保存するのは「ハッシュ化した」コード
          public_token: publicToken, // 画面連携用のトークン
          expires_at: expiresAt,
        },
      });
    });

    // 5. メール送信
    // ユーザーには「ハッシュ化する前の」数字を送らないと認証できないので注意！
    await sendVerificationEmail(email, otpCode);

    // 6. ここまで来たら成功！
    // 画面側には public_token を返して、次の画面で使ってもらいます
    return {
      success: true,
      data: {
        public_token: publicToken,
      },
    };

  } catch (error: any) {
    // エラーが出ちゃった時の処理
    console.error('登録失敗しちゃいました...', error);

    // もし「P2002」ってエラーコードだったら、Unique制約違反（メアド被り）らしいです
    if (error.code === 'P2002') { 
      return {
        success: false,
        error: {
          message: 'そのメールアドレス、もう誰かが使ってるみたいです！',
        },
      };
    }

    // それ以外のよくわかんないエラーの時
    return {
      success: false,
      error: {
        message: 'ごめんなさい、サーバー側で何かエラーが起きました...',
      },
    };
  }
};