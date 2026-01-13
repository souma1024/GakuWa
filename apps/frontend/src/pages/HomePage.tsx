import styles from '../styles/home.module.css';
import ArticleCard from '../components/ArticleCard';
import RankingCard from '../components/RankingCard';
import { postsRanking, useRanking } from '../hooks/useRanking';
import { Article, useArticles } from '../hooks/useArticles';

export default function Homepage() {

  const rankings: postsRanking[] = useRanking();
  const articles: Article[] = useArticles();

  return (
    <>
      <div id="home" className={styles.home}>
        <div id='ranking' className={styles.ranking}>
          <p>ユーザー投稿数ランキング</p>
          {
            rankings.map((ranking, index) => (
              <RankingCard ranking={ ranking } rank={ index + 1} />
            ))
          }
        </div>


        {/* fetchで取得したarticle数分のArticleCardをfor文で作成するべき */}
        <div id='articles' className={styles.articles}>
          {
            articles.map((article, _) => (
              <ArticleCard article={ article }/>
            ))
          }
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