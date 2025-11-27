import axios from 'axios'

// Basic axios instance — baseURL defaults to provided env or localhost:5000/api
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
const DEFAULT_TIMEOUT = 10000 // 10s
const MAX_RETRIES = 2

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: DEFAULT_TIMEOUT,
})

let isRefreshing = false
let pendingRequestsQueue = []

function onRefreshed(token) {
  pendingRequestsQueue.forEach(cb => cb(token))
  pendingRequestsQueue = []
}

/**
 * Attach token to default headers (immediately used for future requests)
 * @param {string|null} token
 */
export function setAuthToken(token) {
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export function clearAuthToken() {
  delete api.defaults.headers.common['Authorization']
}

// request interceptor: ensure the Authorization header is populated
api.interceptors.request.use((config) => {
  // If header already set explicitly, keep it.
  if (!config.headers?.Authorization) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    if (token) config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// response interceptor: handle 401 by attempting a /auth/refresh and retrying
api.interceptors.response.use((res) => res, async (error) => {
  const originalRequest = error.config
  if (!originalRequest) return Promise.reject(error)

  // if server returned 401 and we haven't tried refreshing yet
  if (error.response?.status === 401 && !originalRequest._retry) {
    // avoid multiple simultaneous refresh calls
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequestsQueue.push((token) => {
          if (token) {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            resolve(api(originalRequest))
          } else {
            reject(error)
          }
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true
    try {
      const { data } = await api.post('/auth/refresh')
      const token = data?.token || data?.auth?.token
      if (token) {
        localStorage.setItem('authToken', token)
        setAuthToken(token)
        onRefreshed(token)
        return api(originalRequest)
      }
    } catch (refreshError) {
      // refresh failed — clear auth and continue rejecting
      localStorage.removeItem('authToken')
      clearAuthToken()
      onRefreshed(null)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }

  return Promise.reject(error)
})

/**
 * Internal helper to perform a request with simple retry/backoff logic
 * @param {object} config axios request config
 * @param {number} retries number of attempts remaining
 */
async function requestWithRetry(config, retries = MAX_RETRIES) {
  try {
    return await api.request(config)
  } catch (err) {
    const status = err?.response?.status
    // retry on network errors or 5xx server errors or timeouts
    const shouldRetry = (!status || (status >= 500 && status < 600) || err.code === 'ECONNABORTED') && retries > 0
    if (shouldRetry) {
      const waitMs = 300 * Math.pow(2, MAX_RETRIES - retries)
      await new Promise(r => setTimeout(r, waitMs))
      return requestWithRetry(config, retries - 1)
    }
    throw err
  }
}

/* ------------------------- API convenience functions ------------------------- */

/**
 * Boards
 */
/**
 * Get boards list
 * @returns {Promise<any>} list of boards
 */
export async function getBoardsAPI() {
  const { data } = await requestWithRetry({ method: 'get', url: '/boards' })
  return data
}

/**
 * Create a new board
 * @param {object} board
 * @returns {Promise<any>} created board
 */
export async function createBoardAPI(board) {
  const { data } = await requestWithRetry({ method: 'post', url: '/boards', data: board })
  return data
}

/**
 * Update a board
 * @param {string|number} id
 * @param {object} patch
 * @returns {Promise<any>} updated board
 */
export async function updateBoardAPI(id, patch) {
  const { data } = await requestWithRetry({ method: 'put', url: `/boards/${id}`, data: patch })
  return data
}

/**
 * Delete a board
 * @param {string|number} id
 * @returns {Promise<any>} deletion result
 */
export async function deleteBoardAPI(id) {
  const { data } = await requestWithRetry({ method: 'delete', url: `/boards/${id}` })
  return data
}

/**
 * Tasks
 */
/**
 * Get tasks for board
 * @param {string|number} boardId
 * @returns {Promise<any>} task list
 */
export async function getTasksAPI(boardId) {
  const { data } = await requestWithRetry({ method: 'get', url: `/boards/${boardId}/tasks` })
  return data
}

/**
 * Create task
 * @param {string|number} boardId
 * @param {object} task
 * @returns {Promise<any>} created task
 */
export async function createTaskAPI(boardId, task) {
  const { data } = await requestWithRetry({ method: 'post', url: `/boards/${boardId}/tasks`, data: task })
  return data
}

/**
 * Update task
 * @param {string|number} boardId
 * @param {string|number} taskId
 * @param {object} patch
 * @returns {Promise<any>} updated task
 */
export async function updateTaskAPI(boardId, taskId, patch) {
  const { data } = await requestWithRetry({ method: 'put', url: `/boards/${boardId}/tasks/${taskId}`, data: patch })
  return data
}

/**
 * Delete task
 * @param {string|number} boardId
 * @param {string|number} taskId
 * @returns {Promise<any>} result
 */
export async function deleteTaskAPI(boardId, taskId) {
  const { data } = await requestWithRetry({ method: 'delete', url: `/boards/${boardId}/tasks/${taskId}` })
  return data
}

/**
 * Auth
 */
/**
 * Login
 * @param {{email:string,password:string}} credentials
 */
export async function loginAPI(credentials) {
  const { data } = await requestWithRetry({ method: 'post', url: '/auth/login', data: credentials })
  return data
}

/**
 * Signup
 * @param {object} payload
 */
export async function signupAPI(payload) {
  const { data } = await requestWithRetry({ method: 'post', url: '/auth/signup', data: payload })
  return data
}

/**
 * Logout (notify server then clear client token)
 */
export async function logoutAPI() {
  try {
    const { data } = await requestWithRetry({ method: 'post', url: '/auth/logout' })
    // clear client token
    localStorage.removeItem('authToken')
    clearAuthToken()
    return data
  } catch (err) {
    // still clear token locally
    localStorage.removeItem('authToken')
    clearAuthToken()
    throw err
  }
}

/**
 * Explicit refresh call
 */
export async function refreshTokenAPI() {
  const { data } = await requestWithRetry({ method: 'post', url: '/auth/refresh' })
  return data
}

/**
 * AI
 */
/**
 * Get AI suggestions for a prompt
 * @param {{prompt:string}} payload
 */
export async function getAISuggestionsAPI(payload) {
  const { data } = await requestWithRetry({ method: 'post', url: '/ai/suggestions', data: payload })
  return data
}

// default export keeps previous default export usage
export default api
