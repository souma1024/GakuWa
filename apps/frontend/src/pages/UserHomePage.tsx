import { useParams } from "react-router-dom";

export default function UserHomePage() {
  const { handle } = useParams<{ handle: string }>();

  return (
    <div style={{ padding: "20px" }}>
      <h1>ようこそ、@{handle}さん!</h1>
      <p>ユーザーホーム画面（仮実装）</p>
      
      <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
        <h2>🎉 登録完了</h2>
        <p>OTP認証が成功し、アカウントが有効化されました。</p>
        <p>ハンドル: <strong>@{handle}</strong></p>
      </div>

      <div style={{ marginTop: "20px", color: "#666" }}>
        <p>※ この画面は仮実装です。</p>
        <p>※ 実際のユーザーホーム画面は他のメンバーが実装します。</p>
      </div>
    </div>
  );
}
