import ArticleCard from '../components/ArticleCard'
import { articles } from '../articles/index'

export default function Home() {
  return (
    <>
      <h1>A11y Field Guide</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)' }}>
        Practical accessibility patterns — with working demos and WCAG references.
      </p>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'var(--space-6)',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
        aria-label="Articles"
      >
        {articles.map(article => (
          <li key={article.slug}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </>
  )
}
