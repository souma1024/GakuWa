import { useNavigate } from 'react-router-dom';
import styles from '../styles/profileCard.module.css'

export type User = {
  handle: string;
  name: string;
  avatarUrl: string;
  profile: string | null;
  followersCount: number;
  followingsCount: number;
}

type Props = {
  user: User;
}

export default function ProfileCard({ user }: Props) {

  const url: string = '/api/images/avatars/' + user.avatarUrl;
  const navigate = useNavigate();


  function editProfile() {
    navigate('?mode=edit', { state: user});
  }
  
  return (
    <div className={styles.card}> 
      <img src={url} alt="avatar" className={styles.avatar}/>
      <div className={styles.upper}> 
        <p className={styles.handle}>{user.handle}</p>
        <p className={styles.name}>{user.name}</p>
      </div>
      
      <div className={styles.center}>
        <p>自己紹介</p>
        { user.profile && <p className={styles.intro}>{user.profile}</p> }
        { !user.profile && <p className={styles.intro}>自己紹介文を書いてみよう</p> }
      </div>
      <div className={styles.lower}>
        <div className={styles.articles}>
          <p>0</p>
          <p>投稿数</p>
        </div>
        <div className={styles.followers}>
          <p>{user.followersCount}</p>
          <p>フォロー</p>
        </div>
        <div className={styles.followings}>
          <p>{user.followingsCount}</p>
          <p>フォロワー</p>
        </div>
        
      </div>
      <div className={styles.edit}>
        <button className={styles.editBtn} onClick={ editProfile }>プロフィールを編集する</button>
      </div>
    </div>
  );
}