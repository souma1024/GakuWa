import { Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import OtpVerifyPage from "../pages/OtpVerifyPage";
import UserHomePage from "../pages/UserHomePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";

function App() {
  return (
    <Routes>
      {/* ホームページ */}
      <Route path="/" element={<HomePage />} />

      {/* ログイン */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 新規登録 */}
      <Route path="/signup" element={<SignupPage />} />
      
      {/* OTP入力画面 */}
      <Route path="/signup/otp-verify" element={<OtpVerifyPage />} />
      
      {/* ユーザーホーム画面 */}
      <Route path="/:handle" element={<UserHomePage />} />
      
      {/* 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
