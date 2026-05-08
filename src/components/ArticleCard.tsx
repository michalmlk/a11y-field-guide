import styles from './ArticleCard.module.css'

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  wcag: string
  tags: string[]
}

interface ArticleCardProps {
  article: ArticleMeta
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className={styles.card}>
      <header>
        <h2 className={styles.title}>
          <a href={`/articles/${article.slug}`}>{article.title}</a>
        </h2>
        <p className={styles.wcag}>
          <span className={styles.tag}>WCAG {article.wcag}</span>
        </p>
      </header>
      <p className={styles.description}>{article.description}</p>
      <footer className={styles.footer}>
        <ul className={styles.tags} aria-label="Tags">
          {article.tags.map(tag => (
            <li key={tag} className={styles.tag}>{tag}</li>
          ))}
        </ul>
      </footer>
    </article>
  )
}
