import React, { useCallback, useMemo, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import styles from './KanbanBoard.module.css'
import Column from './Column'

// Sample mock tasks
const SAMPLE_TASKS = [
  { id: 't1', title: 'Create wireframes', description: 'Initial wireframes for dashboard', priority: 'high', status: 'todo' },
  { id: 't2', title: 'Setup backend', description: 'API skeleton and routes', priority: 'medium', status: 'inprogress' },
  { id: 't3', title: 'Auth flow', description: 'Login / signup UI', priority: 'high', status: 'todo' },
  { id: 't4', title: 'Add analytics', description: 'Integrate charts for metrics', priority: 'low', status: 'done' },
  { id: 't5', title: 'Task detail', description: 'Task modal and attachments', priority: 'medium', status: 'inprogress' },
  { id: 't6', title: 'Unit tests', description: 'Add unit tests for reducers', priority: 'low', status: 'todo' },
  { id: 't7', title: 'E2E tests', description: 'Cypress smoke tests', priority: 'medium', status: 'todo' },
  { id: 't8', title: 'Performance', description: 'Bundle and perf checks', priority: 'low', status: 'inprogress' },
  { id: 't9', title: 'Documentation', description: 'Write README and CONTRIBUTING', priority: 'low', status: 'done' },
  { id: 't10', title: 'Release', description: 'Publish v1.0.0', priority: 'high', status: 'done' },
]

const STATUSES = [
  { id: 'todo', label: 'To-Do' },
  { id: 'inprogress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

function getGrouped(tasks) {
  return tasks.reduce((acc, t) => {
    if (!acc[t.status]) acc[t.status] = []
    acc[t.status].push(t)
    return acc
  }, {})
}

function newTaskId() {
  return 't' + Math.random().toString(36).slice(2, 9)
}

export default function KanbanBoard({ initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks || SAMPLE_TASKS)
  const [error, setError] = useState(null)

  const grouped = useMemo(() => getGrouped(tasks), [tasks])

  const onDragEnd = useCallback((result) => {
    try {
      setError(null)
      const { destination, source, draggableId } = result
      if (!destination) return
      const from = source.droppableId
      const to = destination.droppableId
      if (from === to && destination.index === source.index) return

      // Reorder within or between lists
      setTasks(prev => {
        const copy = [...prev]
        const movingIndex = copy.findIndex(t => t.id === draggableId)
        if (movingIndex === -1) return prev // safety
        const [moving] = copy.splice(movingIndex, 1)
        moving.status = to

        // Insert into position inside 'to' group's section — we'll approximate by finding
        // the first position for the node with that status and insert by destination.index
        const destOfSameStatus = copy.filter(t => t.status === to)

        if (destination.index >= destOfSameStatus.length) {
          // append at end of column
          copy.push(moving)
        } else {
          // find the item in copy that corresponds to dest index
          const target = destOfSameStatus[destination.index]
          const insertIndex = copy.findIndex(t => t.id === target?.id)
          copy.splice(insertIndex, 0, moving)
        }

        return copy
      })
    } catch (err) {
      console.error('Drag drop failed', err)
      setError('Could not move the task. Try again.')
    }
  }, [])

  const handleAddTask = useCallback((status) => {
    try {
      setError(null)
      const id = newTaskId()
      const newTask = { id, title: 'New task', description: '', priority: 'medium', status, isNew: true }
      // add at top of status column
      setTasks(prev => [newTask, ...prev])

      // remove the 'isNew' flag after animation period
      setTimeout(() => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, isNew: false } : t))
      }, 900)
    } catch (err) {
      console.error('Add task failed', err)
      setError('Unable to create task.')
    }
  }, [])

  const handleEditTask = useCallback((updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t))
  }, [])

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }, [])

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kanban Board</h1>
        <p className={styles.subtitle}>Drag & drop tasks between columns — mobile responsive.</p>
      </header>

      {error && <div className={styles.error}>{error}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.grid}>
          {STATUSES.map(col => (
            <Column
              key={col.id}
              title={col.label}
              tasks={(grouped[col.id] || []).map((t) => t)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              columnId={col.id}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

KanbanBoard.propTypes = {
  initialTasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.oneOf(['low','medium','high']),
    status: PropTypes.oneOf(['todo','inprogress','done']).isRequired,
  })),
}
