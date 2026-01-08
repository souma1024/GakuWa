import styles from '../styles/main.module.css';

import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from '../pages/BlockPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BsBell } from "react-icons/bs";

export default function MainLayout() {
  const { user, setUser } = useOutletContext<OutletContext>();
  const [focus, setFocus] = useState('home');
  const navigate = useNavigate();

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
            
            {user && <><BsBell className={ styles.bell }/> <Avatar src={user.avatarUrl} user={ user }  /></>}
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
              <strong>イベント</strong>
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
