import { Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import OtpVerifyPage from "../pages/OtpVerifyPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import BlockPage from "../components/BlockPage";
import MainLayout from "../layout/MainLayout";
import ProfilePage from "../pages/ProfilePage";

function App() {
  return (
    <Routes>

      {/* ログイン */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 新規登録 */}
      <Route path="/signup" element={<SignupPage />} />
      
      {/* OTP入力画面 */}
      <Route path="/signup/otp-verify" element={<OtpVerifyPage />} />
      
      {/* ユーザーホーム画面 */}
      <Route element={<BlockPage />}>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<HomePage />} />
          <Route path="/:handle" element={<HomePage />} />
          <Route path="/:handle/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      
      {/* 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
