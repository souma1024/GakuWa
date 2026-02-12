
import { useNavigate } from "react-router-dom";
import styles from '../styles/menu.module.css';
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { User } from "../type/user";

type Props = {
  src: string;
  user: User;
};

export const Menu = ({ user, src }: Props) => {

  const navigate = useNavigate();
  const [isLogout, setIsLogout] = useState(false);
  const { handleLogout } = useAuth();

  return (
    <>
    <div className={ styles.menu }>
      <div className={ styles.profile } onClick={() => navigate(`/${user.handle}/profile`, {state: user}) } >
        <p>公開用プロフィール</p>
      </div>
      <div className={ styles.library } onClick={() => navigate(`/library`, {state: user})}>
        <p>ライブラリ</p>
      </div>
      <div className={ styles.account }>
        <p>アカウント設定</p>
      </div>
      <div className={ styles.logout } onClick={ () => setIsLogout(true) }>
        <p>ログアウト</p>
      </div>
    </div>
      { isLogout && 
        <div className={styles.logoutOverlay} onClick={() => setIsLogout(false)} >

          <div className={styles.logoutConfirm} onClick={(e) => e.stopPropagation()}>

            <p>本当にログアウトしますか？</p>

            <div className={styles.logoutActions}>
              <button className={ `${ styles.buttons } ${ styles.green }` } onClick={handleLogout}>Yes</button>
              <button className={ `${ styles.buttons } ${ styles.red } ` } onClick={() => setIsLogout(false)}>No</button>
            </div>
            
          </div>
        </div>
      }
    </>
  );
}