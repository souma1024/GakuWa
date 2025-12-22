/**
 * 6桁の認証コードを作る関数
 * Math.random()を使って、100000〜999999の間でランダムな数字を出します！
 */

export function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}