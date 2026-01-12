// src/pages/LoginPage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { loginSchema, LoginValues } from "../utils/validation";
import "../styles/login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setSubmitStatus("submitting");

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      
      if (!response.ok) {
        // 4xx / 5xx の場合
        const errorBody = await response.json().catch(() => null);
        setSubmitStatus("error");
        setSubmitError(
          errorBody?.error?.message || 
          "ログインに失敗しました"
        );
        return;
      }

      const result = await response.json();

    console.log("login result: FULL", result);

      const user = result.data;


      console.log("user情報 %o", user)
      // public_tokenを取得してOTP画面に遷移
      if (result.success && user.handle) {
        setSubmitStatus("success");
        
        // OTP入力画面に遷移 (public_tokenをstateで渡す)
        setTimeout(() => {
          navigate(`/${user.handle}`, {
            state: user
          });
        }, 1000);
      } else {
        setSubmitStatus("error");
        setSubmitError("handleNameが取得できませんでした");
      }

    } catch (error) {
      console.error("login error:", error);
      setSubmitStatus("error");
      setSubmitError("通信エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">GakuWa</h1>

          <p className="login-description">
            学校用のメールアドレスを使用してください。
          </p>

          
          <div className="form-group">
            <label className="form-label">メールアドレス</label>
            {errors.email && <p className="error-text">※{errors.email.message}</p>}
            <input
              type="text"
              id="email"
              placeholder="学内用メールアドレス"
              className="form-input"
              {...register("email")}
            />
          </div>

          <div className="form-group">
            <label className="form-label">パスワード</label>
            {errors.password && <p className="error-text">※{errors.password.message}</p>}
            <input
              type="password"
              id="password"
              {...register("password")}
              className="form-input"
            />
          </div>

          <button className="login-button" type="submit" disabled={submitStatus === "submitting"}>
            {submitStatus === "submitting" ? "送信中..." : "ログイン"}
          </button>
          {submitStatus === "error" && <p className="error-text">{submitError}</p>}
          {submitStatus === "success" && (
            <p style={{ color: "green" }}>
              ホーム画面に遷移します
            </p>
          )}
          

          <p className="signup-text">
            アカウントを持っていない場合は
            <Link to="/signup">新規登録</Link>
            から
          </p>
        </div>
      </div>
    </form>
  );
}
