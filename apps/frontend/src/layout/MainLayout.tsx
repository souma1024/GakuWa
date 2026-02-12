import styles from '../styles/main.module.css';

import Button from '../components/Button';
import AvatarMenu from '../components/AvatarMenu';
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsBell } from "react-icons/bs";
import { User } from '../type/user';

export default function MainLayout() {
  const location = useLocation();
  const [focus, setFocus] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const pathname = location.pathname;

  
  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/session", {
          method: "POST",
          credentials: "include",
        });
        const result = await response.json();

        setUser(result?.success ? (result.data ?? null) : null);
      } catch(e) {
        console.log(e);
      }
    };

    check();
  }, []);

  useEffect(() => {
    if (pathname === `/`) {
      setFocus("home");
      return;
    } else if (pathname === `/events`) {
      setFocus("event");
      return;
    } else {
      setFocus("");
      return;
    }
  }, [pathname]);

  function home() {
    setFocus('home');
    navigate('/');
  }

  function event() {
    setFocus('event');
    navigate('/events');
  }

  return (
    <div id="main" className={styles.main}>
      <div id="header" className={styles.header}>
        <div className={styles.headerUpper}>
          <p className={styles.appTitle}>GakuWa</p>
          <div className={styles.headerRight}> 
            <input type="text" placeholder='検索' id='search' className={styles.search}/>
            {!user && 
              <>
                <Button label='ログイン' url='/login' />
                <Button label='新規登録' url='/signup' />
              </>
            }
            
            {user && 
              <>
                <BsBell className={ styles.bell }/> 
                <button className={ styles.createButton } onClick={() => navigate(`/article`)}>記事作成</button>
                <AvatarMenu src={user.avatarUrl} user={ user }  />
              </>}
          </div>
        </div>
        <div className={ styles.headerBottom }>

          <div id='home' className={ styles.home } onClick={home}>
            <div className={ styles.tabTextArea}>
              <strong>ホーム</strong>
            </div>
            { focus === 'home' && <div className={ styles.tabFooter }></div>}
          </div>

          <div id='event' className={ styles.event } onClick={event}>
            <div className={ styles.tabTextArea}>
              <strong>イベント</strong>
            </div>
            { focus === 'event' && <div className={ styles.tabFooter }></div>}
          </div>

          <div id='contact' className={ styles.contact }>
            <div className={ styles.tabTextArea}>
              <strong>お問い合わせ</strong>
            </div>
          </div>

        </div>
        
      </div>

      <div id="content" className={styles.content}>
        <Outlet context={{ user }} />
      </div>

      <div id="footer" className={styles.footer}>
        <div>
          <p><a href="/about">GakuWaについて</a></p>
          <p><a href="/operation">運営チーム</a></p>
          <p><a href="/events">イベント</a></p>
          <p><a href="notice">おしらせ</a></p>
        </div>
      </div>   
    </div>
  );
}
