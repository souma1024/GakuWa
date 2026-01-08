import styles from '../styles/main.module.css';

import Button from '../components/Button';
import AvatarMenu from '../components/AvatarMenu';
import { Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from '../pages/BlockPage';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BsBell } from "react-icons/bs";

export default function MainLayout() {
  const { user, setUser } = useOutletContext<OutletContext>();
  const [focus, setFocus] = useState('');
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  useEffect(() => {
    if (!user?.handle) return;

    if (pathname === "/" || pathname === `/${user.handle}`) {
      setFocus("home");
      return;
    }

    if (pathname === `/${user.handle}/events`) {
      setFocus("event");
      return;
    }
    setFocus('');
  }, [pathname, user?.handle]);

  function home() {
    setFocus('home');
    navigate('/' + user?.handle);
  }

  function event() {
    setFocus('event');
    navigate('/' + user?.handle + '/events');
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
            
            {user && <><BsBell className={ styles.bell }/> <AvatarMenu src={user.avatarUrl} user={ user }  /></>}
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
        <Outlet context={{user, setUser}}/>
      </div>
    </div>
  );
}
