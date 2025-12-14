import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router-dom";
import { otpSchema, OtpValues } from "../utils/validation";

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // デバッグログ
  console.log('=== OtpVerifyPage Debug ===');
  console.log('location:', location);
  console.log('location.state:', location.state);
  
  // SignupPageから渡されたpublic_tokenを取得
  // location.stateから取得、なければURLパラメータから取得
  const stateToken = location.state?.publicToken;
  const urlParams = new URLSearchParams(location.search);
  const urlToken = urlParams.get('token');
  
  const publicToken = stateToken || urlToken;
  
  console.log('stateToken:', stateToken);
  console.log('urlToken:', urlToken);
  console.log('publicToken:', publicToken);
  console.log('===========================');

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // OTP検証処理
  const onSubmit = async (data: OtpValues) => {
    // public_tokenがない場合はエラー
    if (!publicToken) {
      setSubmitStatus("error");
      setSubmitError("セッションが無効です。最初からやり直してください。");
      return;
    }

    setSubmitStatus("submitting");
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookieを送受信
        body: JSON.stringify({
          public_token: publicToken,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // エラーレスポンス
        setSubmitStatus("error");
        setSubmitError(
          result.error?.message || "OTP検証に失敗しました"
        );
        return;
      }

      // 成功
      setSubmitStatus("success");
      const handle = result.data.handle;

      // /@handleに遷移
      setTimeout(() => {
        navigate(`/@${handle}`);
      }, 1000);

    } catch (error) {
      console.error("OTP検証エラー:", error);
      setSubmitStatus("error");
      setSubmitError("通信エラーが発生しました");
    }
  };

  // OTP再送信処理
  const handleResendOtp = async () => {
    if (!publicToken) {
      setResendStatus("error");
      setResendMessage("セッションが無効です");
      return;
    }

    setResendStatus("sending");
    setResendMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/auth/otp/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          public_token: publicToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setResendStatus("error");
        setResendMessage(
          result.error?.message || "OTP再送信に失敗しました"
        );
        return;
      }

      setResendStatus("success");
      setResendMessage("OTPを再送信しました。メールをご確認ください。");

      // 3秒後にメッセージをクリア
      setTimeout(() => {
        setResendStatus("idle");
        setResendMessage("");
      }, 3000);

    } catch (error) {
      console.error("OTP再送信エラー:", error);
      setResendStatus("error");
      setResendMessage("通信エラーが発生しました");
    }
  };

  // public_tokenがない場合はエラー表示
  if (!publicToken) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>エラー</h2>
        <p>無効なアクセスです。</p>
        <button onClick={() => navigate("/signup")}>
          新規登録画面に戻る
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>メール認証</h2>
      <p>メールに送信された6桁のOTPを入力してください。</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="otp">OTP (6桁)：</label>
          <input
            type="text"
            id="otp"
            placeholder="123456"
            maxLength={6}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "20px",
              letterSpacing: "5px",
              textAlign: "center",
            }}
            {...register("otp")}
          />
          {errors.otp && (
            <p style={{ color: "red", fontSize: "14px" }}>
              {errors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitStatus === "submitting"}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            backgroundColor: submitStatus === "submitting" ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitStatus === "submitting" ? "not-allowed" : "pointer",
          }}
        >
          {submitStatus === "submitting" ? "検証中..." : "認証する"}
        </button>

        {submitStatus === "error" && (
          <p style={{ color: "red", marginTop: "10px" }}>{submitError}</p>
        )}

        {submitStatus === "success" && (
          <p style={{ color: "green", marginTop: "10px" }}>
            認証成功！リダイレクト中...
          </p>
        )}
      </form>

      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button
          onClick={handleResendOtp}
          disabled={resendStatus === "sending"}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "4px",
            cursor: resendStatus === "sending" ? "not-allowed" : "pointer",
          }}
        >
          {resendStatus === "sending" ? "送信中..." : "新しいOTPを再送信する"}
        </button>

        {resendMessage && (
          <p
            style={{
              marginTop: "10px",
              color: resendStatus === "success" ? "green" : "red",
            }}
          >
            {resendMessage}
          </p>
        )}
      </div>
    </div>
  );
}
