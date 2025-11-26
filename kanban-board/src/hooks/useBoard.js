import { useState, useEffect } from 'react'
import { fetchBoards } from '../services/boardService'

export default function useBoard() {
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    fetchBoards().then(data => { if (mounted) setBoards(data) }).catch(()=>{}).finally(()=>{ if (mounted) setLoading(false) })
    return ()=>{ mounted = false }
  }, [])

  return { boards, loading }
}
