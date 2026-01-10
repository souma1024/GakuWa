import styles from '../styles/tag.module.css'

type Props = {
  title: string
}

export default function Tag({ title }: Props) {
  return (
    <>
      <div className={ styles.tag }>
        <p>{ title }</p>
      </div>
    </>
  );
}