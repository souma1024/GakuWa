import { BsBookmark } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";

import  Tag  from "../components/Tag"
import ArticleStatus from "./ArticleStatus";

import { dateFomatter } from "../utils/formatter";
import { Article, PublishedArticle } from "../hooks/useArticles";

import styles from "../styles/articleCard.module.css";
import { useNavigate } from "react-router-dom";


type ArticleCardProps = {
  article: Article | PublishedArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {

  const url: string = '/api/images/avatars/' + article.author_avatarUrl;
  const updated_at: string = dateFomatter(article.updated_at);
  const navigate = useNavigate()

  return (
    <>
      <div className={ styles.card }>
        <div className={ styles.wrapper}>
          <div className={ styles.lefter}>
            <img src={ url } alt="avatar" className={ styles.avatar }/>
          </div>
          <div className={ styles.righter }>
            <div className={ styles.header }>
              <div className={ styles.headerLeft }>
                <p>{ article.author }</p>
              </div>
              <div className={ styles.headerRight }>
                {"status" in article && article.status && 
                  <ArticleStatus status={ article.status }/>
                }

                {!("status" in article) && 
                  <div className={ styles.circle }>
                    <BsBookmark />
                  </div>
                }
              </div>
            </div>
            <div className={ styles.center }>
              <strong 
                className={ styles.title }
                onClick={ () => { navigate(`/${article.author}/article?g=${ article.handle }`) } }>
                  { article.title }
                  
                  </strong>
            </div>
            <div className={ styles.tags }>
              {  
                article.tag_names.map((tag) => (
                  <Tag key={ tag } title={ tag }/> 
                ))    
              }
            </div>
            <div className={ styles.footer }>
              <div className={ styles.footerLeft }>  
                {!("status" in article) &&          
                  <> 
                    <BsHeart className={ styles.heart }/>
                    <div className={ styles.likes }> { article.likes_count }</div>
                  </> 
                }
              </div>
              <div className={ styles.footerRight }>
                最終更新日：{ updated_at }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}