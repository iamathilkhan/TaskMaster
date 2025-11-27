import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTasks, createTaskAsync, updateTaskAsync, deleteTaskAsync, moveTaskAsync, selectAllTasks, selectTasksByStatus } from '../redux/slices/taskSlice'

/**
 * useTasks hook — wrap task slice operations and selectors
 * API:
 *  - tasks, loading, error
 *  - load(boardId), create(boardId, task), update(boardId, taskId, patch), remove(boardId, taskId)
 *  - move(boardId, taskId, payload)
 *  - filterByStatus(status)
 */
export default function useTasks() {
  const dispatch = useDispatch()
  const tasks = useSelector(selectAllTasks)
  const loading = useSelector(state => state.task.loading)
  const error = useSelector(state => state.task.error)

  const load = useCallback(async (boardId) => {
    try {
      const res = await dispatch(fetchTasks({ boardId }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) { throw err?.message || err?.toString() }
  }, [dispatch])

  const create = useCallback(async ({ boardId, task }) => {
    try {
      const res = await dispatch(createTaskAsync({ boardId, task }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) { throw err?.message || err?.toString() }
  }, [dispatch])

  const update = useCallback(async ({ boardId, taskId, patch }) => {
    try {
      const res = await dispatch(updateTaskAsync({ boardId, taskId, patch }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) { throw err?.message || err?.toString() }
  }, [dispatch])

  const remove = useCallback(async ({ boardId, taskId }) => {
    try {
      const res = await dispatch(deleteTaskAsync({ boardId, taskId }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) { throw err?.message || err?.toString() }
  }, [dispatch])

  const move = useCallback(async ({ boardId, taskId, payload }) => {
    try {
      const res = await dispatch(moveTaskAsync({ boardId, taskId, payload }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) { throw err?.message || err?.toString() }
  }, [dispatch])

  const filterByStatus = useCallback((status) => selectTasksByStatus({ task: { tasks } }, status), [tasks])

  return {
    tasks,
    loading,
    error,
    load,
    create,
    update,
    remove,
    move,
    filterByStatus,
  }
}

useTasks.propTypes = {
  // no props - hook wrapper for redux
}
import { useState, useEffect } from 'react'
import { fetchTasks } from '../services/taskService'

export default function useTasks(boardId) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if (!boardId) return
    setLoading(true)
    fetchTasks(boardId).then(data => setTasks(data)).catch(()=>{}).finally(()=>setLoading(false))
  }, [boardId])

  return { tasks, loading }
}
