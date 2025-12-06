import { useNavigate } from "react-router-dom"

export default function HomePage() {

  const navigate = useNavigate()
  function goSignupPage() {
    navigate('/signup')
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>Gakuwa 開発ホーム</h1>
      <p>ようこそ！ここから開発を進めていきます。</p>

      <section style={{ marginTop: '24px' }}>
        <h2>このアプリで作るもの</h2>
        <ul>
          <li>✅ ユーザー登録・ログイン</li>
          <li>✅ Qiita 風の記事投稿・一覧・詳細</li>
          <li>✅ コメント・タグ機能</li>
        </ul>
      </section>

      <section style={{ marginTop: '24px' }}>
        <h2>開発の進め方（ざっくり）</h2>
        <ol>
          <li>まずはフロントのページとコンポーネントを増やす</li>
          <li>バックエンドの API を Express で実装</li>
          <li>API とフロントをつなぐ（fetch / axios）</li>
        </ol>
      </section>
      <button onClick={goSignupPage}>
        新規登録画面
      </button>
    </div>
  )
}