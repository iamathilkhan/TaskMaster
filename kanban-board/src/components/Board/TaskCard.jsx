import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styles from './TaskCard.module.css'

export default function TaskCard({ task, index, provided, snapshot, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: task.title, description: task.description || '' })

  function handleToggleEdit(e) {
    e.stopPropagation()
    setEditing(v => !v)
    setForm({ title: task.title, description: task.description || '' })
  }

  function handleSave(e) {
    e.preventDefault()
    if (onEdit) onEdit({ ...task, title: form.title, description: form.description })
    setEditing(false)
  }

  function handleDelete(e) {
    e.stopPropagation()
    // prefer explicit window.confirm (CRA eslint warns about using the global `confirm`)
    if (!window.confirm(`Delete task "${task.title}"?`)) return
    if (onDelete) onDelete(task.id)
  }

  const avatarLetter = (task.assignee && task.assignee.name && task.assignee.name[0]) || (task.assignee || 'A')[0]

  return (
    <div
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
      {...(provided?.dragHandleProps || {})}
      className={`${styles.cardRoot} ${snapshot?.isDragging ? styles.dragging : ''}`}
      style={provided?.draggableProps?.style}
      onClick={() => !editing && setEditing(true)}
      role="article"
      aria-label={task.title}
    >
      {!editing ? (
        <>
          <div className={styles.cardTop}>
            <div className={styles.left}>
              <div className={styles.avatar}>{avatarLetter.toUpperCase()}</div>
              <div className={styles.meta}>
                <h3 className={styles.title}>{task.title}</h3>
                <p className={styles.desc}>{task.description}</p>
              </div>
            </div>

            <div className={styles.controls}>
              <button className={styles.iconBtn} onClick={handleToggleEdit} aria-label="edit task">✎</button>
              <button className={styles.iconBtn} onClick={handleDelete} aria-label="delete task">🗑</button>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.due}>{task.due ? new Date(task.due).toLocaleDateString() : ''}</div>
            <div className={styles.priority} data-p={task.priority}>{task.priority}</div>
          </div>
        </>
      ) : (
        <form className={styles.editForm} onSubmit={handleSave} onClick={e => e.stopPropagation()}>
          <input className={styles.input} value={form.title} onChange={e=>setForm(s=>({ ...s, title: e.target.value }))} />
          <textarea className={styles.input} rows={3} value={form.description} onChange={e=>setForm(s=>({ ...s, description: e.target.value }))} />
          <div className={styles.actions}>
            <button type="button" className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setEditing(false)}>Cancel</button>
            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>Save</button>
          </div>
        </form>
      )}
    </div>
  )
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.oneOf(['low','medium','high']),
    assignee: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    due: PropTypes.string,
    isNew: PropTypes.bool,
  }).isRequired,
  index: PropTypes.number,
  provided: PropTypes.object,
  snapshot: PropTypes.object,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}

TaskCard.defaultProps = {
  index: 0,
  onEdit: null,
  onDelete: null,
}

