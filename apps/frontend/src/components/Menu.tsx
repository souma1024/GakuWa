
import { useNavigate } from "react-router-dom";
import styles from '../styles/menu.module.css';

type User = {
  handle: string;
  name: string;
  avatarUrl: string;
  profile: string | null;
  followersCount: number;
  followingsCount: number;
}

type Props = {
  src: string;
  user: User;
};

export const Menu = ({ user, src }: Props) => {

  const navigate = useNavigate();

  return (
    <div className={ styles.menu }>
      <div className={ styles.profile } onClick={() => navigate(`/${user.handle}/profile`, {state: user}) } >
        <p>公開用プロフィール</p>
      </div>
      <div className={ styles.library }>
        <p>ライブラリ</p>
      </div>
      <div className={ styles.account }>
        <p>アカウント設定</p>
      </div>
      <div className={ styles.logout }>
        <p>ログアウト</p>
      </div>
    </div>
  );
}