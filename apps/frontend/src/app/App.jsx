import { Routes, Route } from "react-router-dom";

import SignupPage from "../pages/SignupPage";
import OtpVerifyPage from "../pages/OtpVerifyPage";
import UserHomePage from "../pages/UserHomePage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import BlockPage from "../components/BlockPage";
import ArticlesList from "../pages/ArticlesList";

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

      {/* ログイン必須エリア */}
      <Route element={<BlockPage />}>
        {/* ユーザーホーム */}
        <Route path="/:handle" element={<UserHomePage />} />

        {/* ★ 記事一覧 */}
        <Route path="/articles" element={<ArticlesList />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
