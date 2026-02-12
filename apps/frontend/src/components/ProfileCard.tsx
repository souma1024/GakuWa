import { useNavigate } from 'react-router-dom';
import styles from '../styles/profileCard.module.css'
import { User } from '../type/user'


type Props = {
  user: User | null;
  userOneself: boolean;
}

export default function ProfileCard({ user, userOneself }: Props) {

  if (!user) {
    return (
      <div className={styles.card}>
        <p className={styles.intro}>ユーザー情報を読み込み中…</p>
      </div>
    );
  } 

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
        {
          userOneself && 
          <button className={styles.btn} onClick={ editProfile }>プロフィールを編集する</button>
        }

        {
          !userOneself && 
          <button className={styles.btn}>フォローする</button>
        }
      </div>
    </div>
  );
}