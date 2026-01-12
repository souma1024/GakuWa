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
  return (
    <>
      <div className={ styles.card }>
        <div className={ styles.left}>
          <p>{rank}</p>
        </div>
        <div className={ styles.right }>
          <div className={ styles.avatarContainer}>
            <img src={ ranking.avatar_url } alt="avatar" className={ styles.avatar } />
          </div>
          <div className={ styles.textContainer }>
            <p className={ styles.handleName }>{ranking.handle}</p>
            <p className={ styles.postsCount}>投稿数: {ranking.posts_count}</p>
          </div>
        </div>
      </div>
    </>
  );
}