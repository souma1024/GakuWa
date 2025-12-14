import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, handle, loading } = useAuth();

  useEffect(() => {
    // 認証済みの場合は/@handleにリダイレクト
    if (!loading && isAuthenticated && handle) {
      navigate(`/@${handle}`);
    }
  }, [loading, isAuthenticated, handle, navigate]);

  // ローディング中
  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>読み込み中...</p>
      </div>
    );
  }

  // 未認証の場合はホームページを表示
  return (
    <div style={{ padding: "20px" }}>
      <h1>GakuWa へようこそ</h1>
      <p>学生限定のブログ投稿Webアプリです。</p>
      
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          新規登録
        </button>
        
        <button
          onClick={() => alert("ログイン機能は他メンバーが実装予定です")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ログイン
        </button>
      </div>
    </div>
  );
}
