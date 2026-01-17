import { useEffect, useState } from "react";
import { marked } from "marked";
import parse from "html-react-parser";
import styles from "../styles/article.module.css"
import { useNavigate, useLocation } from "react-router-dom";

type DetailArticle = {
  
}

export default function ArticlePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [reading, setReading] = useState("");
  const [isWrite, setIsWrite] = useState(true);
  const [title, setTitle] = useState("");
  const [contentMd, setContentMd] = useState("");
  const [contentHtml, setContentHtml] = useState("");

  useEffect(() => {
    
    const query = new URLSearchParams(location.search);
    const g = query.get('g');

    if (g) {
      setReading(g);
      getArticleHtml(g);
    };
  }, [location.search]);

  async function saves() {
    try {
      
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

  useEffect(() => {
    const id = setTimeout(async () => {
      const html = await marked.parse(contentMd);
      setContentHtml(html);
    }, 200);

    return () => clearTimeout(id);
  }, [contentMd]);

  async function getArticleHtml(articleHandle: string) {
    try {
      const res = await fetch(`http://localhost:8080/api/articles/${articleHandle}`, {
        method: "GET"
      })

      const result = await res.json();
      console.log("result: ", result);
    } catch(e) {
      console.log(e);
    }
  }

  

  return (
    <>
      { !reading && 
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
                  onClick={() => {
                    setIsWrite(true)
                  }} >
                  <p className={`${isWrite ? styles.focus : ""}`}>write</p>
                </div>
                <div 
                  className={ styles.mode } 
                  onClick={() => setIsWrite(false)} 
                  >
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
      { reading && 
        <>
          <div className={ styles.container }>
            <div className={ styles.lefter}>

            </div>
            <div className={ styles.center }>

            </div>
          </div>
        </>
      }
    </>
  );
}