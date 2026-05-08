import styles from './CodeCompare.module.css'

interface CodeCompareProps {
  bad: string
  good: string
  badLabel?: string
  goodLabel?: string
}

export default function CodeCompare({
  bad,
  good,
  badLabel = 'Inaccessible',
  goodLabel = 'Accessible',
}: CodeCompareProps) {
  return (
    <div className={styles.compare} role="group" aria-label="Code comparison">
      <figure className={styles.panel}>
        <figcaption className={styles.label} data-variant="bad">
          <span aria-hidden="true">✗</span> {badLabel}
        </figcaption>
        <pre className={styles.code}><code>{bad}</code></pre>
      </figure>
      <figure className={styles.panel}>
        <figcaption className={styles.label} data-variant="good">
          <span aria-hidden="true">✓</span> {goodLabel}
        </figcaption>
        <pre className={styles.code}><code>{good}</code></pre>
      </figure>
    </div>
  )
}
