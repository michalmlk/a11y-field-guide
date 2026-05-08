import type { ReactNode } from 'react'
import ThemeToggle from './ThemeToggle'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <a href="/" className={styles.logo} aria-label="A11y Field Guide home">
            A11y Field Guide
          </a>
          <nav aria-label="Primary navigation">
            <ul className={styles.nav}>
              <li><a href="/">Articles</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
          <ThemeToggle />
        </header>
        <main id="main-content" className={styles.main} tabIndex={-1}>
          {children}
        </main>
        <footer className={styles.footer}>
          <p>Built to explore web accessibility patterns.</p>
        </footer>
      </div>
    </>
  )
}
