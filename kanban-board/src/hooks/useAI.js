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
