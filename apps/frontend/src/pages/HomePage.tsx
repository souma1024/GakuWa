import styles from '../styles/home.module.css';
import ArticleCard from '../components/ArticleCard';

// fetchでarticle情報を取得し以下の形式に直す
export const article = {
  title: "ReactとTypeScriptを使ってWebサービスを作った話",
  author: "test user",
  author_avatarUrl: '/api/images/avatars/default_avatar.png',
  likes_count: "11",
  tag_names: ["react", "css", "typescript", "Minio", "javascript", "cookie"],
  // 要素数が多くなると見切れてしまうので、後で直す
  updatedAt: "2026/01/10"
}

export default function Homepage() {
  return (
    <>
    <div id="home" className={styles.home}>
      <div id='ranking' className={styles.ranking}>
        <p>人気ランキング</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
      </div>

      {/* fetchで取得したarticle数分のArticleCardをfor文で作成するべき */}
      <div id='articles' className={styles.articles}>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
        <ArticleCard article={ article }/>
      </div>

      <div id='pop' className={styles.pop}>

      </div>      
    </div>
    <div id="footer" className={styles.footer}>
      <div>
        <p><a href="/about">GakuWaについて</a></p>
        <p><a href="/operation">運営チーム</a></p>
        <p><a href="/events">イベント</a></p>
        <p><a href="notice">おしらせ</a></p>
      </div>
      
    </div>   
    </>
  );  
}