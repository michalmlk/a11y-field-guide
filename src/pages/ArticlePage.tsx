import { lazy, Suspense, useMemo } from 'react'
import type { ComponentType } from 'react'
import { articles } from '../articles/index'
import type { ArticleMeta } from '../components/ArticleCard'

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
      <Suspense fallback={<p>Loading…</p>}>
        <MDXContent />
      </Suspense>
    </article>
  )
}
