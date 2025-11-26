import React, { useState } from 'react'
import PropTypes from 'prop-types'
import api from '../../services/api'
import styles from './AIAssistant.module.css'

export default function AIAssistant({ prompt, onApply }) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)

  async function analyze() {
    setError(null)
    setToast(null)
    setLoading(true)
    try {
      // call API endpoint; fallback to a mocked response if it fails
      const res = await api.post('/ai/analyze-task', { prompt })
      const data = res?.data
      if (!data || !Array.isArray(data.suggestions)) {
        throw new Error('Invalid AI response')
      }
      setSuggestions(data.suggestions)
    } catch (err) {
      console.warn('AI fetch failed, using fallback suggestions', err?.message || err)
      setError('Could not reach AI service, showing local suggestions')
      setToast('AI service unavailable — using offline suggestions. You can still apply them.')
      // fallback  — produce 2 suggestions derived from prompt
      setSuggestions([{
        id: 'ai_local_1',
        suggestion: `Improve: ${prompt || 'Clarify acceptance criteria and break the work down into smaller tasks.'}`,
        priority: 'medium',
        estHours: 6,
        deadlineDays: 5,
        tips: 'Split into 2–3 sub-tasks and add acceptance criteria.',
        tags: ['breakdown','acceptance']
      }, {
        id: 'ai_local_2',
        suggestion: `Add tests and small UI tweaks for: ${prompt || 'validation, edge cases'}`,
        priority: 'low',
        estHours: 3,
        deadlineDays: 7,
        tips: 'Add unit tests and one end-to-end test.',
        tags: ['testing','qa']
      }])
    } finally {
      setLoading(false)
      // clear toast after a few seconds
      if (toast) setTimeout(() => setToast(null), 4500)
    }
  }

  function applySuggestion(sug) {
    if (onApply) {
      // map suggestion to form fields — prefer full suggestion text to description
      const payload = {
        title: sug.suggestion?.split('\n')?.[0]?.slice(0,100) || '',
        description: sug.suggestion || '',
        priority: sug.priority || 'medium',
        // derive due date as X days from now if suggested
        due: sug.deadlineDays ? new Date(Date.now() + sug.deadlineDays * 24 * 60 * 60 * 1000).toISOString() : null,
      }
      onApply(payload)
    }
  }

  return (
    <div className={styles.wrapper}>
      <button className={styles.btn} onClick={analyze} disabled={loading} aria-label="Get AI Suggestions">
        {loading ? <span className={styles.spinner} aria-hidden /> : '✨ Get AI Suggestions'}
      </button>

      {error && <div className={styles.meta}>{error}</div>}

      {suggestions.length > 0 && (
        <div className={styles.cards} role="region" aria-live="polite">
          {suggestions.map(s => (
            <div key={s.id} className={`${styles.card} ${document.body.classList.contains('dark') ? styles.cardDark : ''}`}>
              <div className={styles.left}>
                <div className={styles.icon}>AI</div>
                <div className={styles.applyWrap}><button className={styles.applyBtn} onClick={() => applySuggestion(s)}>Apply</button></div>
              </div>

              <div className={styles.body}>
                <div className={styles.row}>
                  <div className={styles.priority + ' ' + (s.priority || 'medium')}>{(s.priority || 'medium').toUpperCase()}</div>
                  <div className={styles.meta}>{s.estHours ? `${s.estHours}h est` : ''} {s.deadlineDays ? ` • ${s.deadlineDays}d` : ''}</div>
                </div>

                <div className={styles.tip}>{s.suggestion}</div>

                <div className={styles.row}>
                  <div className={styles.tags}>
                    {(s.tags || []).slice(0,5).map(tag => <span key={tag} className={styles.tag}>#{tag}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}

AIAssistant.propTypes = {
  prompt: PropTypes.string,
  onApply: PropTypes.func,
}

AIAssistant.defaultProps = {
  prompt: '',
  onApply: null,
}
import React from 'react'

export default function AIAssistant() {
  return (
    <div style={{border: '1px dashed #ccc', padding: 12}}>
      <h4>AI Assistant (placeholder)</h4>
      <p>This imaginary assistant would help users create or refine tasks using AI.</p>
    </div>
  )
}
