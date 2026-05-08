import { useState, useCallback } from 'react'
import { runAxe, type AxeResult } from '../utils/run-axe'
import styles from './AuditPanel.module.css'

export default function AuditPanel() {
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
      setError(e instanceof Error ? e.message : 'Audit failed')
    } finally {
      setRunning(false)
    }
  }, [])

  const violationCount = results?.violations.length ?? 0

  return (
    <aside className={styles.panel} aria-label="Accessibility audit">
      <div className={styles.header}>
        <span className={styles.title}>A11y Audit</span>
        <button
          onClick={run}
          disabled={running}
          className={styles.runBtn}
          aria-busy={running}
        >
          {running ? 'Running…' : 'Run axe'}
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
          aria-label={`Audit complete: ${violationCount} violation${violationCount !== 1 ? 's' : ''}`}
        >
          {violationCount === 0 ? (
            <p className={styles.pass}>No violations found</p>
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
