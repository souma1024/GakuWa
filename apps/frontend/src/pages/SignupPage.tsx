import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { signupSchema, SignupValues } from "../utils/validation";

import "../styles/Signup.css";

export default function SignupPage() {
  const navigate = useNavigate();
  
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupValues) => {
    setSubmitStatus("submitting");

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
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
          "新規登録に失敗しました"
        );
        return;
      }

      const result = await response.json();
      console.log("Success:", result);

      // public_tokenを取得してOTP画面に遷移
      if (result.success && result.data.public_token) {
        setSubmitStatus("success");
        
        // OTP入力画面に遷移 (public_tokenをstateで渡す)
        setTimeout(() => {
          navigate("/signup/otp-verify", {
            state: { publicToken: result.data.public_token }
          });
        }, 500);
      } else {
        setSubmitStatus("error");
        setSubmitError("public_tokenが取得できませんでした");
      }

    } catch (error) {
      console.error("signup error:", error);
      setSubmitStatus("error");
      setSubmitError("通信エラーが発生しました");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <div>
          <label htmlFor="username">ユーザ名：</label>
          <input
            type="text"
            id="username"
            placeholder="表示名"
            {...register("username")}
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="email">メールアドレス：</label>
          <input
            type="text"
            id="email"
            placeholder="メールアドレス"
            {...register("email")}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">パスワード：</label>
          <input
            type="password"
            id="password"
            placeholder="パスワード"
            {...register("password")}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={submitStatus === "submitting"}>
          {submitStatus === "submitting" ? "送信中..." : "送信する"}
        </button>
        {submitStatus === "error" && <p className="error">{submitError}</p>}
        {submitStatus === "success" && (
          <p style={{ color: "green" }}>
            登録メールを送信しました。OTP入力画面に移動します...
          </p>
        )}
      </div>
    </form>
  );
}
