import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupValues } from "../utils/validation";

import "../styles/Signup.css";

export default function SignupPage() {
  
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
      agreement: false,
    },
  });

  const onSubmit = async (data: SignupValues) => {
    setSubmitStatus("submitting");

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
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
        setSubmitError("Failed to load resource: the server responded with a status of 404 (Not Found)");
        return;
      }

      const result = await response.json();
      console.log("Success:", result);

      
      setSubmitStatus("success");
      reset(); // フォームリセット
    } catch (error) {
      setSubmitStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="main">
        <div className="content">

          <div className="title">
            <p className="title-size">GakuWa</p>
          </div>
          
          <div className="intro">
            <div>
              <p className="intro-size">GakuWaへようこそ。</p>
              <p className="intro-size">新規登録して利用を開始しましょう。</p>
            </div>
          </div>
          
          <div className="form">
            <div className="input-field">
              <div className="text">
                <label htmlFor="username">ユーザー名</label>
                {errors.username && <p className="error-msg">※{errors.username.message}</p>}
              </div>
              <input
                type="text"
                id="username"
                {...register("username")}
              />
            </div>
            <div className="input-field">
              <div className="text">
                <label htmlFor="email">メールアドレス</label>
                {errors.email && <p className="error-msg">※{errors.email.message}</p>}
              </div>
              <input
                type="text"
                id="email"
                placeholder="学内用メールアドレス"
                {...register("email")}
              />
            </div>
            <div className="input-field">
              <div className="text">
                <label htmlFor="password">パスワード</label>
                {errors.password && <p className="error-msg">※{errors.password.message}</p>}
              </div>
              <input
                type="password"
                id="password"
                {...register("password")}
              />
            </div>
          </div>

          <div className="submit">
            <div className="agreement">
              <input  
                type="checkbox" 
                id="agreement"
                 {...register("agreement", { required: true })}
                />
              <div className="text">
                <p><a href="">利用規約</a>に同意する</p>
                {errors.agreement && <p className="error-msg">※{errors.agreement.message}</p>}
              </div>
              
            </div>
            <div className="submit-button">
              <button className="btn-signup" type="submit" disabled={submitStatus === "submitting"}>
              {submitStatus === "submitting" ? "送信中..." : "新規登録"}
              </button>
              {submitStatus === "error" && <p className="error-msg">{submitError}</p>}
            </div>
          </div>
        </div>
      </div>  
    </form>
  )
}

