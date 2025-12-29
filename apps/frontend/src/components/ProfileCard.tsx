import styles from '../styles/profileCard.module.css'

type User = {
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
  
  return (
    <div className={styles.card}> 
      <img src={url} alt="avatar" className={styles.avatar}/>
      <p className={styles.handle}>{user.handle}</p>
      <p className={styles.name}>{user.name}</p>
      <div>
        <p>自己紹介</p>
        <p className={styles.intro}>{user.profile}</p>
      </div>
      <div className={styles.footer}>
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
    </div>
  );
}