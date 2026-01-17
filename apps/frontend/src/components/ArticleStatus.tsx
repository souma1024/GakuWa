import styles from "../styles/piece.module.css";

type Props = {
  status: string
}

export default function ArticleStatus(status: Props) {
  const statusText = status.status;

  // 記事を公開する関数
  function publish() {

  }

  return (
    <>
      <div className={`${ styles.status } ${styles[statusText] ?? ""}`} >
        <p className={ styles.text }>{ statusText }</p>
      </div>
    </>
  );
}