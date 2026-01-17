import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useArticles } from "../hooks/useArticles";
import  ArticleCard  from "../components/ArticleCard";
import styles from "../styles/library.module.css";


export default function LibraryPage() {
  const location = useLocation();
  const user = location.state;
  const { articles, fetchUsersArticles } = useArticles();

  useEffect(() => {
    fetchUsersArticles(user.handle);
  }, [])

  return (
   <>
    <div className={ styles.main }>
      <div className={ styles.articles }>
        {
          articles.map((article, _) => (
            <ArticleCard key={ article.handle } article={ article }/>
          ))
        }
      </div>
    </div>
   </> 
  );
}