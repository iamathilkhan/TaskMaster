import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) { state.user = action.payload },
    setToken(state, action) { state.token = action.payload },
    logout(state) { state.user = null; state.token = null },
    setLoading(state, action) { state.loading = action.payload },
    setError(state, action) { state.error = action.payload },
  }
})

export const { setUser, setToken, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer
