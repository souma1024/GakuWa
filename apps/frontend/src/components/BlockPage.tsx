import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

export default function BlockPage() {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/session", {
          method: "POST",
          credentials: "include",
        });
        
        setAllowed(res.ok);
      } catch {
        setAllowed(false);
      }
    };

    check();
  }, []);

  
  if (allowed === null) return <div>Loading...</div>;

  
  if (!allowed) return (
    <div>
      <h1>404 NOT FOUND</h1>
      <h2>ページが見つかりませんでした</h2>
      <a href="/">ホーム画面に戻る</a>
    </div>
  );

  // OKなら配下を描画
  return <Outlet />;
}