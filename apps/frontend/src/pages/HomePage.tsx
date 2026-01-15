import styles from '../styles/home.module.css';
import ArticleCard from '../components/ArticleCard';
import RankingCard from '../components/RankingCard';
import { postsRanking, useRanking } from '../hooks/useRanking';
import { useArticles } from '../hooks/useArticles';
import { useEffect } from 'react';

export default function Homepage() {

  const rankings: postsRanking[] = useRanking();
  const { articles, fetchArticles } = useArticles();

  useEffect(() => {
    fetchArticles(); // 全記事
  }, []);

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
    </>
  );  
}