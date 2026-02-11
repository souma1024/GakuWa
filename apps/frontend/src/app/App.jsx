import { Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import OtpVerifyPage from "../pages/OtpVerifyPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ArticlesList from "../pages/ArticlesList";
import BlockPage from "../pages/BlockPage";
import MainLayout from "../layout/MainLayout";
import ProfilePage from "../pages/ProfilePage";
import EventsPage from "../pages/EventsPage";
import ArticlePage from "../pages/ArticlePage";
import LibraryPage from "../pages/LibraryPage";

function App() {
  return (
    <Routes>
      {/* ログイン */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 新規登録 */}
      <Route path="/signup" element={<SignupPage />} />
      
      {/* OTP入力画面 */}
      <Route path="/signup/otp-verify" element={<OtpVerifyPage />} />
      
      
      <Route element={<MainLayout/>}>
        {/* 認証済みユーザーのみ閲覧可能 */}
        <Route element={<BlockPage />}>

          {/* 認証済みかどうかで表示を変える */}
          <Route path="/" element={<HomePage />} />
          
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/article" element={<ArticlePage />} />
          <Route path="/library" element={<LibraryPage />}/>

        </Route>

        {/* 誰でも閲覧できるページ */}
        <Route path="/:handle/article" element={<ArticlePage />} />
        <Route path="/:handle/profile" element={<ProfilePage />}/>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
