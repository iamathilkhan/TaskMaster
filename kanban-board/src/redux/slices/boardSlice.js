import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as boardService from '../../services/boardService'

const initialState = {
  boards: [],
  currentBoard: null,
  loading: false,
  error: null,
}

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async (_, thunkAPI) => {
  try {
    const data = await boardService.fetchBoards()
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to load boards')
  }
})

export const createBoardAsync = createAsyncThunk('boards/createBoard', async (payload, thunkAPI) => {
  try {
    const data = await boardService.createBoard(payload)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to create board')
  }
})

export const updateBoardAsync = createAsyncThunk('boards/updateBoard', async ({ id, patch }, thunkAPI) => {
  try {
    const data = await boardService.updateBoard(id, patch)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to update board')
  }
})

export const deleteBoardAsync = createAsyncThunk('boards/deleteBoard', async (id, thunkAPI) => {
  try {
    await boardService.deleteBoard(id)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to delete board')
  }
})

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards(state, action) { state.boards = action.payload },
    addBoard(state, action) { state.boards.push(action.payload) },
    setCurrentBoard(state, action) { state.currentBoard = action.payload },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchBoards.fulfilled, (state, action) => { state.loading = false; state.boards = action.payload || [] })
      .addCase(fetchBoards.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(createBoardAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createBoardAsync.fulfilled, (state, action) => { state.loading = false; state.boards.unshift(action.payload) })
      .addCase(createBoardAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(updateBoardAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateBoardAsync.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.boards.findIndex(b => b.id === action.payload.id)
        if (idx !== -1) state.boards[idx] = action.payload
        if (state.currentBoard && state.currentBoard.id === action.payload.id) state.currentBoard = action.payload
      })
      .addCase(updateBoardAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(deleteBoardAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteBoardAsync.fulfilled, (state, action) => {
        state.loading = false
        state.boards = state.boards.filter(b => b.id !== action.payload)
        if (state.currentBoard && state.currentBoard.id === action.payload) state.currentBoard = null
      })
      .addCase(deleteBoardAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })
  }
})

export const { setBoards, addBoard, setCurrentBoard, setLoading, setError } = boardSlice.actions

// selectors
export const selectAllBoards = state => state.board.boards
export const selectCurrentBoard = state => state.board.currentBoard

export default boardSlice.reducer
