import styles from '../styles/home.module.css';

export default function Homepage() {
  return (
    <>
    <div id="home" className={styles.home}>
      <div id='ranking' className={styles.ranking}>
        <p>人気ランキング</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
        <p>1位: React</p>
      </div>

      <div id='articles' className={styles.articles}>

      </div>

      <div id='pop' className={styles.pop}>

      </div>      
    </div>
    <div id="footer" className={styles.footer}>
      <div>
        <p><a href="/about">GakuWaについて</a></p>
        <p><a href="/operation">運営チーム</a></p>
        <p><a href="/events">イベント</a></p>
        <p><a href="notice">おしらせ</a></p>
      </div>
      
    </div>   
    </>
  );  
}