import { BsBookmark } from "react-icons/bs";
import { BsHeart } from "react-icons/bs";

import  Tag  from "../components/Tag"

import styles from "../styles/articleCard.module.css";

type Article = {
  title: string;
  author: string;
  author_avatarUrl: string,
  likes_count: string,
  tag_names: string[],
  updatedAt: string;
}

type ArticleCardProps = {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <>
      <div className={ styles.card }>
        <div className={ styles.wrapper}>
          <div className={ styles.lefter}>
            <img src={ article.author_avatarUrl } alt="avatar" className={ styles.avatar }/>
          </div>
          <div className={ styles.righter }>
            <div className={ styles.header }>
              <div className={ styles.headerLeft }>
                <p>{ article.author }</p>
              </div>
              <div className={ styles.headerRight }>
                <div className={ styles.circle }>
                  <BsBookmark />
                </div>
              </div>
            </div>
            <div className={ styles.center }>
              <strong className={ styles.title }>{ article.title }</strong>
            </div>
            <div className={ styles.tags }>
              {
                article.tag_names.map((tag, index) => (
                  <Tag title={tag} />
                ))  
              }
            </div>
            <div className={ styles.footer }>
              <div className={ styles.footerLeft }>             
                <BsHeart className={ styles.heart }/>
                <div className={ styles.likes }>{ article.likes_count }</div>
              </div>
              <div className={ styles.footerRight }>
                { article.updatedAt }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}