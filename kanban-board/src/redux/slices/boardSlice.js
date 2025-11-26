import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  boards: [],
  loading: false,
  error: null,
}

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards(state, action) { state.boards = action.payload },
    addBoard(state, action) { state.boards.push(action.payload) },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  }
})

export const { setBoards, addBoard, setLoading, setError } = boardSlice.actions
export default boardSlice.reducer
