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
