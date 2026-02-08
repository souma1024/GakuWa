import { useEffect, useState } from "react";
import { marked } from "marked";
import parse from "html-react-parser";
import styles from "../styles/article.module.css"
import { useNavigate, useLocation } from "react-router-dom";
import { dateFomatter } from "../utils/formatter";
import Tag from "../components/Tag";

type DetailArticle = {
  title: string;
  createdAt: string;
  updatedAt: string;
  contentMd: string;
  contentHtml: string;
  handle: string;
  likesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  publishedAt: string;
  author_handle: string;
  avatarUrl: string;
  tag_names: string[];
};



export default function ArticlePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isWrite, setIsWrite] = useState(true);
  const [title, setTitle] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [articleDetailData, setArticleDetailData] = useState<DetailArticle>();

  useEffect(() => {
    
    const query = new URLSearchParams(location.search);
    const g = query.get('g');

    if (g) {
      getDetailArticle(g);
    } else {
      setArticleDetailData(undefined);
    }
  }, [location.search]);

  useEffect(() => {
    const convert = async () => {
      const html = await marked.parse(contentMd);
      setContentHtml(html);
    };

    convert();
  }, [isWrite]);


  async function saves() {
    try {
      setIsWrite(false);
      
      const data = {
        title: title,
        contentMd: contentMd,
        contentHtml: contentHtml,
        status: "draft"
      }

      const res = await fetch("http://localhost:8080/api/articles/create", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: "include"
      });

      const result = await res.json();
      const handle: string = result.data.handle;

      if (result.success) {
        navigate(`/${handle}/library`, {state: handle});
      } else {

      }
    } catch(e) {
      console.log(e);
    }
  }

  async function getDetailArticle(articleHandle: string) {
    try {
      const res = await fetch(`http://localhost:8080/api/articles/${articleHandle}`, {
        method: "GET"
      })

      const result = await res.json();

      let data = result.data.article;
      console.log(data);
      data.createdAt = dateFomatter(data.createdAt);
      data.updatedAt = dateFomatter(data.updatedAt);
      data.avatarUrl = '/api/images/avatars/' + data.author.avatarUrl;
      data.author_handle = data.author.handle;
      data.tag_names = data.articleTags.map( (t :any ) => t.tag.name);
      setArticleDetailData(result.data.article);
    } catch(e) {
      console.log(e);
    }
  }

  

  return (
    <>
      { !articleDetailData && 
        <>
          <div className={ styles.wrapper }>
            <div className={ styles.title }>
              <p>記事のタイトル</p>
              <input type="text" onChange={(e) => setTitle(e.target.value)}/>
            </div>
            <p className={ styles.contentDispcription }>記事の内容</p>
            <div className={ styles.content }>
              <div className={ styles.options }>
                <div 
                  className={ styles.mode } 
                  onClick={() => setIsWrite(true)} >
                  <p className={`${isWrite ? styles.focus : ""}`}>write</p>
                </div>
                <div 
                  className={ styles.mode } 
                  onClick={() => { setIsWrite(false) }} >
                  <p className={`${!isWrite ? styles.focus : ""}`}>preview</p>
                </div>
              </div>
              { isWrite && 
                <textarea 
                  name="contentMd" 
                  id="contentMd" 
                  className={ styles.contentMd } 
                  value={contentMd}
                  onChange={(e) => setContentMd(e.target.value)}  
                >
                
                </textarea>
              } 
              { !isWrite && 
                <>
                  <div id="contentHtml" className={ styles.contentHtml }>
                    { parse(contentHtml) }
                  </div>
                </>
              }
            </div>

            <div className={ styles.save }>
              <button className={ styles.saveButton } onClick={ saves }>保存する</button>
            </div>
            
          </div>
        </>
      }
      {articleDetailData && 
        <>
          <div className={ styles.container }>
            <div className={ styles.lefter}>

            </div>
            <div className={ styles.center }>
              <div className={ styles.article }>
                <div className={ styles.articleInfo }>
                  <div className={ styles.userInfo }>
                    <div>
                      <img src={ articleDetailData.avatarUrl } alt="avatar"  className={ styles.avatar }/>
                    </div>
                    <div className={ styles.usernameField }>
                      <p className={ styles.username }>{ articleDetailData.author_handle }</p>
                    </div>
                  </div>
                  <div>
                    <p className={ styles.readingTitle }>{ articleDetailData.title }</p>
                  </div>
                  <div>
                    <div className={ styles.tags }>
                      {
                        articleDetailData.tag_names.map((tag, index) => (
                          <Tag key={ index } title={ tag } />
                        ))
                      }
                    </div>
                  </div>
                  <div className={ styles.date }>
                    <div>
                      <p >最終更新日：{ articleDetailData.updatedAt }</p>
                    </div>
                    <div>
                      {
                        articleDetailData.publishedAt && 
                        <p>公開日： { articleDetailData.publishedAt }</p>
                      }
                    </div>
                  </div>
                </div>

                <div className={ styles.articleContent }>
                  { parse(articleDetailData.contentHtml) }
                </div>
              </div>
            </div>
            <div className={ styles.righter }>

            </div>
          </div>
        </>
      }
    </>
  );
}