import { useState } from "react";
import styles from "../styles/piece.module.css";

type Props = {
  status: string,
  handle: string
}

export default function ArticleStatus({ handle, status}: Props) {
  const [statusText, setStatusText] = useState(status);

  // 記事を公開する関数
  async function publish() {
    try {
      const res = await fetch(`http://localhost:8080/api/articles/publish`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ handle: handle }),
      });

      if (!res) {
        console.log("失敗");
      }

      const result = await res.json();
      setStatusText(result.data.status);
    } catch(e) {
      console.log(e);
    }
  }

  return (
    <>
      <div className={`${ styles.status } ${styles[statusText] ?? ""}`} onClick={publish}>
        <p className={ styles.text }>{ statusText }</p>
      </div>
    </>
  );
}