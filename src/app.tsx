import { useState, useEffect } from 'react'
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
  const [location, setLocation] = useState(getPage)

  useEffect(() => {
    const handler = () => setLocation(getPage())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  const { page, slug } = location

  return (
    <Layout>
      {page === 'home' && <Home />}
      {page === 'about' && <About />}
      {page === 'article' && <ArticlePage slug={slug ?? ''} />}
    </Layout>
  )
}
