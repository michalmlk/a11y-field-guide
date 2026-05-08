import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import ArticlePage from './pages/ArticlePage'

type Page = 'home' | 'about' | 'article'

function getPage(): { page: Page; slug?: string } {
  const path = window.location.pathname
  if (path === '/about') return { page: 'about' }
  const m = path.match(/^\/articles\/([^/]+)\/?$/)
  if (m) return { page: 'article', slug: m[1] }
  return { page: 'home' }
}

export default function App() {
  const { page, slug } = getPage()

  return (
    <Layout>
      {page === 'home' && <Home />}
      {page === 'about' && <About />}
      {page === 'article' && <ArticlePage slug={slug ?? ''} />}
    </Layout>
  )
}
