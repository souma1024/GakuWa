import styles from '../styles/home.module.css';
import ArticleCard from '../components/ArticleCard';
import RankingCard from '../components/RankingCard';
import { useRanking } from '../hooks/useRanking';
import { useArticles } from '../hooks/useArticles';
import { useEffect } from 'react';

export default function Homepage() {

  const { postsRanking, fetchPosts } = useRanking();
  const { publishedArticles, fetchPublishedArticles } = useArticles();

  useEffect(() => {
    fetchPublishedArticles(); 
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div id="home" className={styles.home}>
        <div id='ranking' className={styles.ranking}>
          <p>ユーザー投稿数ランキング</p>
          {
            postsRanking.map((ranking, index) => (
              <RankingCard key={ ranking.handle} ranking={ ranking } rank={ index + 1} />
            ))
          }
        </div>

        <div id='articles' className={styles.articles}>
          {
            publishedArticles.map((article, _) => (
              <ArticleCard key={ article.handle } article={ article }/>
            ))
          }
        </div>

        <div id='pop' className={styles.pop}>

        </div>      
      </div>
    </>
  );  
}