import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api, { setAuthToken, clearAuthToken } from '../../services/api'

// parse JWT payload safely to extract exp timestamp
function parseJwt(token) {
  try {
    const [, payload] = token.split('.')
    if (!payload) return null
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch (err) {
    return null
  }
}

let refreshTimer = null

function scheduleRefresh(dispatch, token) {
  try {
    if (!token) return
    const payload = parseJwt(token)
    if (!payload || !payload.exp) return
    const expiresAt = payload.exp * 1000
    const now = Date.now()
    const msUntil = expiresAt - now
    // refresh 60 seconds before expiry, or sooner if short-lived
    const refreshIn = Math.max(msUntil - 60_000, 1000)
    if (refreshTimer) clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      dispatch(refreshToken())
    }, refreshIn)
  } catch (err) {
    // ignore scheduling failures
  }
}

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password, remember }, thunkAPI) => {
  try {
    const res = await api.post('/auth/login', { email, password, remember })
    const data = res.data
    // support both top-level token or nested auth.token
    const token = data?.token || data?.auth?.token
    const user = data?.user || data?.auth?.user || null
    if (!token) throw new Error('No token returned from server')
    // persist token
    localStorage.setItem('authToken', token)
    setAuthToken(token)
    // schedule refresh
    scheduleRefresh(thunkAPI.dispatch, token)
    return { token, user }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/registerUser', async ({ name, email, password }, thunkAPI) => {
  try {
    const res = await api.post('/auth/signup', { name, email, password })
    const data = res.data
    const token = data?.token || data?.auth?.token
    const user = data?.user || data?.auth?.user || null
    if (!token) throw new Error('No token returned')
    localStorage.setItem('authToken', token)
    setAuthToken(token)
    scheduleRefresh(thunkAPI.dispatch, token)
    return { token, user }
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Signup failed')
  }
})

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, thunkAPI) => {
  try {
    const res = await api.post('/auth/refresh')
    const data = res.data
    const token = data?.token || data?.auth?.token
    const user = data?.user || data?.auth?.user || null
    if (!token) throw new Error('No token returned by refresh')
    localStorage.setItem('authToken', token)
    setAuthToken(token)
    scheduleRefresh(thunkAPI.dispatch, token)
    return { token, user }
  } catch (err) {
    // auto logout when refresh fails
    thunkAPI.dispatch(logoutUser())
    return thunkAPI.rejectWithValue(err?.response?.data?.message || err.message || 'Refresh failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  try {
    // optionally notify server
    try { await api.post('/auth/logout') } catch (_) {}
  } finally {
    localStorage.removeItem('authToken')
    clearAuthToken()
    if (refreshTimer) { clearTimeout(refreshTimer); refreshTimer = null }
  }
})

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('authToken') : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('authToken')),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // local logout (sync action)
    clearAuth(state) {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      // register
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      // refresh
      .addCase(refreshToken.pending, (state) => { state.loading = true; state.error = null })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.token
        state.user = action.payload.user || state.user
        state.isAuthenticated = true
      })
      .addCase(refreshToken.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error.message })

      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.loading = false
        state.error = null
        state.isAuthenticated = false
      })

  }
})

export const { clearAuth } = authSlice.actions

// selectors
export const selectUser = state => state.auth.user
export const selectIsAuthenticated = state => Boolean(state.auth.token)
export const selectLoading = state => state.auth.loading

export default authSlice.reducer
