export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  // ここで本当にメールを送る処理を書く予定
  console.log(`[メール送信テスト] 宛先: ${email}, コード: ${code}`);
  return true;
}