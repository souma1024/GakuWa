import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from 'browser-image-compression';

// import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState<File | null>(null);

  // const { isAuthenticated, handle, loading } = useAuth();

  // useEffect(() => {
  //   // 認証済みの場合は/@handleにリダイレクト
  //   if (!loading && isAuthenticated && handle) {
  //     navigate(`/@${handle}`);
  //   }
  // }, [loading, isAuthenticated, handle, navigate]);

  // // ローディング中
  // if (loading) {
  //   return (
  //     <div style={{ padding: "20px", textAlign: "center" }}>
  //       <p>読み込み中...</p>
  //     </div>
  //   );
  // }
  

  const getCompressedAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const avatar: File = e.target.files[0];

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedAvatar: File = await imageCompression(avatar, options);
      setAvatar(compressedAvatar);  
    } catch(error) {
      console.log(error);
    }
  } 

  const submitAvatar = async () => {
    if (!avatar) return;
    const data = new FormData()
    data.append('file', avatar)

    try {
      const response = await fetch('http://localhost:8080/api/images/upload', {
        method: 'POST',
        credentials: "include",
        body: data
      });

      const result = await response.json();

      const objectKey = result.data;
      let avatarImage = document.getElementById('avatarImage') as HTMLInputElement;

      if (!avatarImage) {
        return
      }

      avatarImage.src = 'api/images/' + objectKey;
      
    } catch {
      console.log("エラー")
    }
  }

  
  // 未認証の場合はホームページを表示
  return (
    <div style={{ padding: "20px" }}>
      <h1>GakuWa へようこそ</h1>
      <p>学生限定のブログ投稿Webアプリです。</p>
      
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/signup")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          新規登録
        </button>
        
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ログイン
        </button>

        <form>
          <div>
            <label htmlFor="avatar">アップロードするアバター画像を選択してください</label>
            <input type="file" id="avatar" name="avatar" accept="image/*, .pdf" onChange={getCompressedAvatar}/>
            <input type="button" value="アップロード" onClick={submitAvatar} />
          </div>
  
          <p>アバター</p>
          
          <img id="avatarImage" src="/api/images/avatars/default_avatar.png" width="200" alt="" />

        </form>

      </div>
    </div>
  );
}
