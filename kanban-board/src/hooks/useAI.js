import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAISuggestions, clearSuggestions, selectAISuggestions, selectAILoading, selectAIError } from '../redux/slices/aiSlice'

/** useAI hook — wrappers around AI suggestions slice */
export default function useAI() {
  const dispatch = useDispatch()
  const suggestions = useSelector(selectAISuggestions)
  const loading = useSelector(selectAILoading)
  const error = useSelector(selectAIError)

  const getSuggestions = useCallback(async ({ prompt }) => {
    try {
      const res = await dispatch(fetchAISuggestions({ prompt }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) { throw err?.message || err?.toString() }
  }, [dispatch])

  const clear = useCallback(() => dispatch(clearSuggestions()), [dispatch])

  return { suggestions, loading, error, getSuggestions, clear }
}

useAI.propTypes = {
  // no props - hook for redux
}
import { useState } from 'react'
import { generateTaskSuggestions } from '../services/aiService'

export default function useAI() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  const ask = async (prompt) => {
    setLoading(true)
    const result = await generateTaskSuggestions(prompt)
    setSuggestions(result)
    setLoading(false)
    return result
  }

  return { suggestions, loading, ask }
}
