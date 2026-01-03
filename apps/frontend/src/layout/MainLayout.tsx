import styles from '../styles/main.module.css';

import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from '../pages/BlockPage';

export default function MainLayout() {
  const { user, setUser } = useOutletContext<OutletContext>();

  return (
    <div id="main" className={styles.main}>
      <div id="header" className={styles.header}>
        <p className={styles.appTitle}>GakuWa</p>
        <div className={styles.headerRight}> 
          <input type="text" placeholder='検索' id='search' className={styles.search}/>
          {!user && 
            <>
              <Button label='ログイン' url='/login' />
              <Button label='新規登録' url='/signup' />
            </>
          }
          
          {user && <Avatar src={user.avatarUrl} user={ user } />}
        </div>
      </div>

      <div id="content" className={styles.content}>
        <Outlet context={{user, setUser}}/>
      </div>
    </div>
  );
}
