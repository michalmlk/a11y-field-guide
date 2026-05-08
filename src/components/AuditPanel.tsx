import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { runAxe, type AxeResult } from '../utils/run-axe'
import styles from './AuditPanel.module.css'

export default function AuditPanel() {
  const { t } = useTranslation()
  const [results, setResults] = useState<AxeResult | null>(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(async () => {
    setRunning(true)
    setError(null)
    try {
      const result = await runAxe()
      setResults(result)
    } catch (e) {
      setError(e instanceof Error ? e.message : t('audit.failed'))
    } finally {
      setRunning(false)
    }
  }, [t])

  const violationCount = results?.violations.length ?? 0

  return (
    <aside className={styles.panel} aria-label={t('audit.panelLabel')}>
      <div className={styles.header}>
        <span className={styles.title}>{t('audit.title')}</span>
        <button
          onClick={run}
          disabled={running}
          className={styles.runBtn}
          aria-busy={running}
        >
          {running ? t('audit.running') : t('audit.run')}
        </button>
      </div>
      {error && (
        <div className={styles.results} role="alert" aria-live="assertive">
          <p className={styles.violation}>{error}</p>
        </div>
      )}
      {results && (
        <div
          className={styles.results}
          role="status"
          aria-live="polite"
          aria-label={t('audit.complete', { count: violationCount })}
        >
          {violationCount === 0 ? (
            <p className={styles.pass}>{t('audit.noViolations')}</p>
          ) : (
            <ul className={styles.list}>
              {results.violations.map(v => (
                <li key={v.id} className={styles.violation}>
                  <strong>{v.id}</strong>: {v.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  )
}
