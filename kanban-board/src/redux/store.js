import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import boardReducer from './slices/boardSlice'
import taskReducer from './slices/taskSlice'
import aiReducer from './slices/aiSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardReducer,
    task: taskReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
})

export default store
