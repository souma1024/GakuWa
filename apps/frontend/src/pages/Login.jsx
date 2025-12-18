// src/pages/Login.jsx
import { useState } from "react";
import { loginSchema } from "../utils/validation";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault(); // ← submit を止める

    const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    // ★ ここが決定打
    const fieldErrors = result.error.flatten().fieldErrors;

    setErrors({
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    });
    return;
  }

  // OK のとき
  setErrors({});
  
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h1 className="login-title">GakuWa</h1>

        <p className="login-description">
          学校用のメールアドレスを使用してください。
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label">メールアドレス</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            {errors.email && (
              <p className="error-text">{errors.email}</p>
            )}
          </div>

          {/* パスワード */}
          <div className="form-group">
            <label className="form-label">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}
          </div>

          <button type="submit" className="login-button"> 
            ログイン
          </button>
        </form>

        <p className="signup-text">
          アカウントを持っていない場合は
          <a href="/signup">新規登録</a>
          から
        </p>
      </div>
    </div>
  );
}
