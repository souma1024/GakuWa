import styles from "../styles/article.module.css"

export default function ArticlePage() {


  return (
    <>
      <div className={ styles.wrapper }>
        <div className={ styles.title }>
          <p>記事のタイトル</p>
          <input type="text" />
        </div>
        <p className={ styles.contentDispcription }>記事の内容</p>
        <div className={ styles.content }>
          <div className={ styles.options }>
            <div className={ styles.mode }>
              <p>write</p>
            </div>
            <div className={ styles.mode }>
              <p>preview</p>
            </div>
          </div>
          <textarea name="contentMd" id="contentMd" className={ styles.contentMd }>
            
          </textarea>

        </div>

        <div className={ styles.save }>
          <button className={ styles.saveButton } >保存する</button>
        </div>
        
      </div>
    </>
  );
}