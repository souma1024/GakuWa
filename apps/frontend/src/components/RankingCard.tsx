import { useNavigate } from 'react-router-dom'
import styles from '../styles/rankingCard.module.css'

type Props = {
  handle: string,
  avatar_url: string,
  posts_count: string
}

type rankingProps = {
  ranking: Props,
  rank: number
}

export default function RankingCard({ ranking, rank }: rankingProps) {
  const url = '/api/images/avatars/' + ranking.avatar_url;
  const navigate = useNavigate();

  return (
    <>
      <div className={ styles.card }>
        <div className={ styles.left}>
          <p>{rank}</p>
        </div>
        <div className={ styles.right }>
          <div className={ styles.avatarContainer}>
            <img src={ url } alt="avatar" className={ styles.avatar } />
          </div>
          <div className={ styles.textContainer }>
            <p className={ styles.handleName } onClick={() => navigate(`/${ranking.handle}/profile`)  }>{ranking.handle}</p>
            <p className={ styles.postsCount}>投稿数: {ranking.posts_count}</p>
          </div>
        </div>
      </div>
    </>
  );
}