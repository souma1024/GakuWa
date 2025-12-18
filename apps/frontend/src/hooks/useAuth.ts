import { useState, useEffect } from "react";

interface AuthState {
  isAuthenticated: boolean;
  handle: string | null;
  loading: boolean;
}

/**
 * セッション状態を確認するカスタムフック
 * Cookie内のsession_idを確認し、認証状態を返す
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    handle: null,
    loading: true,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // バックエンドの認証確認エンドポイントを呼ぶ
        // TODO: 他メンバーが実装するまでは、cookieの存在だけチェック
        const response = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          credentials: "include", // Cookieを送信
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.handle) {
            setAuthState({
              isAuthenticated: true,
              handle: result.data.handle,
              loading: false,
            });
            return;
          }
        }

        // 認証されていない
        setAuthState({
          isAuthenticated: false,
          handle: null,
          loading: false,
        });
      } catch (error) {
        console.error("認証チェックエラー:", error);
        // エラー時は未認証として扱う
        setAuthState({
          isAuthenticated: false,
          handle: null,
          loading: false,
        });
      }
    };

    checkAuth();
  }, []);

  return authState;
};
