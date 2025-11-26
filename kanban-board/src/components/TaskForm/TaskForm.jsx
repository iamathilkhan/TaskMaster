import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styles from './TaskForm.module.css'
import AIAssistant from './AIAssistant'

const PRIORITIES = ['high', 'medium', 'low']

export default function TaskForm({ initialData, assignees, onSubmit, onCancel }) {
  const isEdit = Boolean(initialData?.id)
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState(initialData?.priority || 'medium')
  const [assignee, setAssignee] = useState(initialData?.assignee || '')
  const [due, setDue] = useState(initialData?.due ? initialData.due.slice(0,10) : '')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // AIAssistant provides suggestions and calls onApply to auto-fill fields

  useEffect(() => {
    if (!initialData) return
    setTitle(initialData.title || '')
    setDescription(initialData.description || '')
    setPriority(initialData.priority || 'medium')
    setAssignee(initialData.assignee || '')
    setDue(initialData.due ? initialData.due.slice(0,10) : '')
  }, [initialData])

  function validate() {
    const out = {}
    if (!title || title.trim().length === 0) out.title = 'Title is required'
    else if (title.length > 100) out.title = 'Title must be 100 characters or fewer'

    if (description && description.length > 500) out.description = 'Description must be 500 characters or fewer'

    // simple due date sanity check
    if (due && isNaN(new Date(due).getTime())) out.due = 'Invalid date'

    setErrors(out)
    return Object.keys(out).length === 0
  }

  function handleApplySuggestion(sug) {
    // suggestion payload: { title, description, priority, due }
    setTitle(prev => prev || sug.title || '')
    setDescription(prev => prev || sug.description || '')
    if (sug.priority) setPriority(sug.priority)
    if (sug.due) setDue(sug.due.slice(0,10))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = { ...initialData, title: title.trim(), description: description.trim(), priority, assignee, due: due || null }
      // simulate async save
      await (onSubmit ? onSubmit(payload) : Promise.resolve(payload))

      // on success: clear form if not editing
      if (!isEdit) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setAssignee('')
        setDue('')
      }
    } catch (err) {
      console.error('submit failed', err)
      setErrors({ form: 'Could not save the task — try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.formRoot} onSubmit={handleSubmit} aria-label={isEdit ? 'Edit task' : 'Create task'}>
      <div className={styles.row}>
        <div className={styles.col} style={{ flex: 2 }}>
          <label className={styles.label}>Title *</label>
          <input className={styles.input} value={title} onChange={e=>setTitle(e.target.value)} maxLength={100} />
          {errors.title && <div className={styles.error}>{errors.title}</div>}
        </div>

        <div className={styles.col} style={{ flex: 1 }}>
          <label className={styles.label}>Priority</label>
          <select className={styles.select} value={priority} onChange={e=>setPriority(e.target.value)}>
            {PRIORITIES.map(p => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <label className={styles.label}>Description</label>
          <textarea className={styles.textarea} value={description} onChange={e=>setDescription(e.target.value)} maxLength={500} />
          {errors.description && <div className={styles.error}>{errors.description}</div>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col} style={{ flex: 1 }}>
          <label className={styles.label}>Assignee</label>
          <select className={styles.select} value={assignee} onChange={e=>setAssignee(e.target.value)}>
            <option value="">Unassigned</option>
            {assignees.map(a => <option key={a.id || a} value={a.id || a}>{a.name || a}</option>)}
          </select>
        </div>

        <div className={styles.col} style={{ flex: 1 }}>
          <label className={styles.label}>Due date</label>
          <input className={styles.input} type="date" value={due} onChange={e=>setDue(e.target.value)} />
          {errors.due && <div className={styles.error}>{errors.due}</div>}
        </div>

        <div style={{display:'flex', alignItems: 'flex-end'}}>
          <AIAssistant prompt={`${title ? title + ' — ' : ''}${description ? description : ''}`} onApply={handleApplySuggestion} />
        </div>
      </div>

      {errors.form && <div className={styles.error}>{errors.form}</div>}

      <div className={styles.actions}>
        <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={onCancel}>Cancel</button>
        <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={submitting}>{submitting ? 'Saving...' : (isEdit ? 'Save changes' : 'Create Task')}</button>
      </div>
    </form>
  )
}

TaskForm.propTypes = {
  initialData: PropTypes.object,
  assignees: PropTypes.array,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
}

TaskForm.defaultProps = {
  initialData: null,
  assignees: [],
  onSubmit: null,
  onCancel: () => {},
}

