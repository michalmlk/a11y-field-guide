import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './DemoShell.module.css'

interface DemoShellProps {
  title: string
  /** Receives the container element; return a cleanup function */
  mount: (container: HTMLElement) => (() => void) | void
}

export default function DemoShell({ title, mount }: DemoShellProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const cleanup = mount(el)
    return () => {
      cleanup?.()
      el.innerHTML = ''
    }
  }, [mount])

  return (
    <section className={styles.shell} aria-label={t('demo.label', { title })}>
      <h3 className={styles.heading}>{title}</h3>
      <div className={styles.stage} ref={containerRef} />
    </section>
  )
}
