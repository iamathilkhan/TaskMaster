import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  tasks: [],
  loading: false,
  error: null,
}

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks(state, action) { state.tasks = action.payload },
    addTask(state, action) { state.tasks.push(action.payload) },
    updateTask(state, action) {
      const idx = state.tasks.findIndex(t => t.id === action.payload.id)
      if (idx !== -1) state.tasks[idx] = action.payload
    },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  }
})

export const { setTasks, addTask, updateTask, setLoading, setError } = taskSlice.actions
export default taskSlice.reducer
