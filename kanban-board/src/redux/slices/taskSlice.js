import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as taskService from '../../services/taskService'

const initialState = {
  tasks: [],
  loading: false,
  error: null,
}

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ boardId }, thunkAPI) => {
  try {
    const data = await taskService.fetchTasks(boardId)
    return { boardId, tasks: data }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to load tasks')
  }
})

export const createTaskAsync = createAsyncThunk('tasks/createTask', async ({ boardId, task }, thunkAPI) => {
  try {
    const data = await taskService.createTask(boardId, task)
    return { boardId, task: data }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to create task')
  }
})

export const updateTaskAsync = createAsyncThunk('tasks/updateTask', async ({ boardId, taskId, patch }, thunkAPI) => {
  try {
    const data = await taskService.updateTask(boardId, taskId, patch)
    return { boardId, task: data }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to update task')
  }
})

export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async ({ boardId, taskId }, thunkAPI) => {
  try {
    await taskService.deleteTask(boardId, taskId)
    return { boardId, taskId }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to delete task')
  }
})

export const moveTaskAsync = createAsyncThunk('tasks/moveTask', async ({ boardId, taskId, payload }, thunkAPI) => {
  try {
    const data = await taskService.moveTask(boardId, taskId, payload)
    return { boardId, task: data }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Failed to move task')
  }
})

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.tasks = action.payload.tasks || [] })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(createTaskAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(createTaskAsync.fulfilled, (state, action) => { state.loading = false; state.tasks.unshift(action.payload.task) })
      .addCase(createTaskAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(updateTaskAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.tasks.findIndex(t => t.id === action.payload.task.id)
        if (idx !== -1) state.tasks[idx] = action.payload.task
      })
      .addCase(updateTaskAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(deleteTaskAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = state.tasks.filter(t => t.id !== action.payload.taskId)
      })
      .addCase(deleteTaskAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      .addCase(moveTaskAsync.pending, (state) => { state.loading = true; state.error = null })
      .addCase(moveTaskAsync.fulfilled, (state, action) => {
        state.loading = false
        // replace task with returned task
        const idx = state.tasks.findIndex(t => t.id === action.payload.task.id)
        if (idx !== -1) state.tasks[idx] = action.payload.task
        else state.tasks.push(action.payload.task)
      })
      .addCase(moveTaskAsync.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })
  }
})

export const { setTasks, addTask, updateTask, setLoading, setError } = taskSlice.actions

// selectors
export const selectAllTasks = state => state.task.tasks
export const selectTasksByStatus = (state, status) => (state.task.tasks || []).filter(t => t.status === status)

export default taskSlice.reducer
