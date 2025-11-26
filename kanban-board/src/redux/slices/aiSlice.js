import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
}

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setSuggestions(state, action) { state.suggestions = action.payload },
    addSuggestion(state, action) { state.suggestions.push(action.payload) },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  }
})

export const { setSuggestions, addSuggestion, setLoading, setError } = aiSlice.actions
export default aiSlice.reducer
