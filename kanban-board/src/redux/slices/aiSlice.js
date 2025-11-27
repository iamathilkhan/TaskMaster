import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as aiService from '../../services/aiService'

const initialState = {
  suggestions: [],
  loading: false,
  error: null,
}

// async thunk
export const fetchAISuggestions = createAsyncThunk('ai/fetch', async ({ prompt }, thunkAPI) => {
  try {
    const data = await aiService.generateTaskSuggestions(prompt)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'AI fetch failed')
  }
})

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    setSuggestions(state, action) { state.suggestions = action.payload },
    addSuggestion(state, action) { state.suggestions.push(action.payload) },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
    clearSuggestions(state) { state.suggestions = [] },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAISuggestions.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchAISuggestions.fulfilled, (state, action) => { state.loading = false; state.suggestions = action.payload })
      .addCase(fetchAISuggestions.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })
  }
})



export const { setSuggestions, addSuggestion, setLoading, setError, clearSuggestions } = aiSlice.actions

// selectors
export const selectAISuggestions = state => state.ai.suggestions
export const selectAILoading = state => state.ai.loading
export const selectAIError = state => state.ai.error
export default aiSlice.reducer
