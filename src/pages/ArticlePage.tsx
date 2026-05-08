import { lazy, Suspense, useMemo, Component } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { articles } from '../articles/index'
import type { ArticleMeta } from '../components/ArticleCard'

class ArticleErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    if (this.state.failed) return (
      <div>
        <p>Could not load article.</p>
        <a href="/">Back to articles</a>
      </div>
    )
    return this.props.children
  }
}

const mdxModules = import.meta.glob<{ default: ComponentType }>(
  '../articles/*.mdx'
)

export default function ArticlePage({ slug }: { slug: string }) {
  const meta: ArticleMeta | undefined = articles.find(a => a.slug === slug)

  const MDXContent = useMemo(() => {
    const loader = mdxModules[`../articles/${slug}.mdx`]
    if (!loader) return null
    return lazy(loader)
  }, [slug])

  if (!meta || !MDXContent) {
    return (
      <div>
        <h1>Article not found</h1>
        <p><a href="/">Back to articles</a></p>
      </div>
    )
  }

  return (
    <article>
      <header>
        <nav aria-label="Breadcrumb">
          <a href="/">Articles</a> / {meta.title}
        </nav>
        <h1>{meta.title}</h1>
        <p>
          <span>WCAG {meta.wcag}</span>
        </p>
        <ul aria-label="Tags">
          {meta.tags.map(tag => <li key={tag}>{tag}</li>)}
        </ul>
      </header>
      <ArticleErrorBoundary>
        <Suspense fallback={<p>Loading…</p>}>
          <MDXContent />
        </Suspense>
      </ArticleErrorBoundary>
    </article>
  )
}
