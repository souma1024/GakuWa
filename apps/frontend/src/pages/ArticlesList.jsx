import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          "/api/articles?status=draft",
          { credentials: "include" } // ★重要
        );

        if (!res.ok) {
          throw new Error("記事の取得に失敗しました");
        }

        const json = await res.json();
        setArticles(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "24px" }}>
      <h1>記事一覧（下書き）</h1>

      <div style={{ marginBottom: "16px" }}>
        <Link to="/articles/new">
          <button>＋ 新規作成</button>
        </Link>
      </div>

      <table width="100%" cellPadding={10}>
        <thead>
          <tr>
            <th align="left">タイトル</th>
            <th align="left">作成日</th>
            <th align="left">操作</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{new Date(a.createdAt).toLocaleString()}</td>
              <td>
                <Link to={`/articles/${a.id}/edit`}>
                  編集
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
