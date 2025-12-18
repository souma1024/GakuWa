import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // SignupPageから渡されたpublic_tokenを取得
  const stateToken = location.state?.publicToken;
  const urlParams = new URLSearchParams(location.search);
  const urlToken = urlParams.get('token');
  
  const publicToken = stateToken || urlToken;

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");
  const [resendStatus, setResendStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP入力処理
  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // キーボード操作
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ペースト処理
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  // OTP検証処理
  const handleSubmit = async () => {
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      setSubmitError("6桁のコードを入力してください");
      return;
    }

    if (!publicToken) {
      setSubmitStatus("error");
      setSubmitError("セッションが無効です。最初からやり直してください。");
      return;
    }

    setSubmitStatus("submitting");
    setSubmitError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          public_token: publicToken,
          otp: otpValue,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setSubmitStatus("error");
        setSubmitError(result.error?.message || "OTP検証に失敗しました");
        return;
      }

      setSubmitStatus("success");
      const handle = result.data.handle;

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
      const response = await fetch("http://localhost:8080/api/auth/otp/send", {
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
        setResendMessage(result.error?.message || "OTP再送信に失敗しました");
        return;
      }

      setResendStatus("success");
      setResendMessage("コードを再送信しました");

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
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}>
        <div style={{
          background: "white",
          borderRadius: "8px",
          padding: "48px 32px",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}>
          <h2 style={{ 
            fontSize: "20px", 
            marginBottom: "16px", 
            color: "#333",
            fontWeight: "500",
          }}>
            エラー
          </h2>
          <p style={{ color: "#666", marginBottom: "24px", fontSize: "14px" }}>
            無効なアクセスです。
          </p>
          <button
            onClick={() => navigate("/signup")}
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            新規登録画面に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f5f5f5",
      padding: "20px",
    }}>
      <div style={{
        background: "white",
        borderRadius: "8px",
        padding: "48px 32px",
        maxWidth: "480px",
        width: "100%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}>
        {/* タイトル */}
        <h1 style={{
          fontSize: "32px",
          fontWeight: "700",
          textAlign: "center",
          marginBottom: "8px",
          color: "#4a90e2",
          letterSpacing: "0.05em",
        }}>
          Gakuwa
        </h1>
        
        <p style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "40px",
          fontSize: "14px",
        }}>
          メールに送信された6桁のコードを入力してください。
        </p>

        {/* OTP入力欄 */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "14px",
            color: "#333",
          }}>
            認証コード
          </label>
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                style={{
                  width: "48px",
                  height: "56px",
                  fontSize: "24px",
                  fontWeight: "600",
                  textAlign: "center",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#4a90e2";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ddd";
                }}
              />
            ))}
          </div>
        </div>

        {/* エラーメッセージ */}
        {submitStatus === "error" && (
          <p style={{
            color: "#e74c3c",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
          }}>
            {submitError}
          </p>
        )}

        {/* 成功メッセージ */}
        {submitStatus === "success" && (
          <p style={{
            color: "#27ae60",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
          }}>
            認証成功しました
          </p>
        )}

        {/* 認証ボタン */}
        <button
          onClick={handleSubmit}
          disabled={submitStatus === "submitting" || otp.join("").length !== 6}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "500",
            background: submitStatus === "submitting" || otp.join("").length !== 6
              ? "#ccc"
              : "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: submitStatus === "submitting" || otp.join("").length !== 6
              ? "not-allowed"
              : "pointer",
            marginBottom: "24px",
          }}
        >
          {submitStatus === "submitting" ? "認証中..." : "認証する"}
        </button>

        {/* 再送信セクション */}
        <div style={{ textAlign: "center" }}>
          <p style={{ 
            color: "#666", 
            fontSize: "14px", 
            marginBottom: "12px",
          }}>
            コードが届きませんか？
            <button
              onClick={handleResendOtp}
              disabled={resendStatus === "sending"}
              style={{
                marginLeft: "8px",
                padding: "0",
                fontSize: "14px",
                background: "none",
                color: "#4a90e2",
                border: "none",
                cursor: resendStatus === "sending" ? "not-allowed" : "pointer",
                textDecoration: "underline",
              }}
            >
              {resendStatus === "sending" ? "送信中..." : "再送信"}
            </button>
          </p>

          {resendMessage && (
            <p style={{
              fontSize: "14px",
              color: resendStatus === "success" ? "#27ae60" : "#e74c3c",
            }}>
              {resendMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
