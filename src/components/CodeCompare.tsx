import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './CodeCompare.module.css'
import { highlight } from '../utils/shiki'

interface CodeCompareProps {
  bad: string
  good: string
  badLabel?: string
  goodLabel?: string
  lang?: string
}

export default function CodeCompare({
  bad,
  good,
  badLabel,
  goodLabel,
  lang = 'tsx',
}: CodeCompareProps) {
  const { t } = useTranslation()
  const [highlighted, setHighlighted] = useState<{ bad: string; good: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([highlight(bad, lang), highlight(good, lang)])
      .then(([badHtml, goodHtml]) => {
        if (!cancelled) setHighlighted({ bad: badHtml, good: goodHtml })
      })
      .catch(err => {
        if (import.meta.env.DEV) console.warn('CodeCompare: shiki failed', err)
      })
    return () => {
      cancelled = true
    }
  }, [bad, good, lang])

  const resolvedBadLabel = badLabel ?? t('codeCompare.inaccessible')
  const resolvedGoodLabel = goodLabel ?? t('codeCompare.accessible')

  return (
    <div className={styles.compare} role="group" aria-label={t('codeCompare.groupLabel')}>
      <figure className={styles.panel}>
        <figcaption className={styles.label} data-variant="bad">
          <span aria-hidden="true">✗</span> {resolvedBadLabel}
        </figcaption>
        {highlighted ? (
          <div className={styles.code} dangerouslySetInnerHTML={{ __html: highlighted.bad }} />
        ) : (
          <pre className={styles.code}><code>{bad}</code></pre>
        )}
      </figure>
      <figure className={styles.panel}>
        <figcaption className={styles.label} data-variant="good">
          <span aria-hidden="true">✓</span> {resolvedGoodLabel}
        </figcaption>
        {highlighted ? (
          <div className={styles.code} dangerouslySetInnerHTML={{ __html: highlighted.good }} />
        ) : (
          <pre className={styles.code}><code>{good}</code></pre>
        )}
      </figure>
    </div>
  )
}
