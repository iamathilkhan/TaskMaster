import api from './api'

const TIMEOUT_MS = 30_000
const MAX_RETRIES = 2
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

const relatedCache = new Map()

async function requestWithRetry(config, retries = MAX_RETRIES) {
  try {
    // ensure timeout fallback
    const merged = { timeout: TIMEOUT_MS, ...config }
    const res = await api.request(merged)
    return res.data
  } catch (err) {
    const status = err?.response?.status
    const shouldRetry = (!status || (status >= 500 && status < 600) || err.code === 'ECONNABORTED') && retries > 0
    if (shouldRetry) {
      const backoff = 200 * Math.pow(2, MAX_RETRIES - retries)
      await new Promise((r) => setTimeout(r, backoff))
      return requestWithRetry(config, retries - 1)
    }
    throw err
  }
}

/**
 * Validate analyzeTask response shape
 * @param {object} obj
 */
function validateAnalyzeResponse(obj) {
  if (!obj) return false
  const keys = ['suggested_priority', 'estimated_hours', 'suggested_deadline_days', 'completion_tips', 'related_keywords']
  return keys.every(k => Object.prototype.hasOwnProperty.call(obj, k))
}

/**
 * Analyze a task by sending title/description to AI service.
 * POST /ai/analyze-task
 * Returns: { suggested_priority, estimated_hours, suggested_deadline_days, completion_tips, related_keywords }
 * @param {string} title
 * @param {string} description
 * @returns {Promise<object>} analysis result
 */
export async function analyzeTask(title, description) {
  if (!title || !description) throw new Error('title and description are required')

  try {
    const data = await requestWithRetry({ method: 'post', url: '/ai/analyze-task', data: { title, description } })
    if (!validateAnalyzeResponse(data)) throw new Error('Invalid response shape from AI analyze endpoint')
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'AI analyzeTask failed'
    throw new Error(message)
  }
}

/**
 * Suggest related tasks for a given taskId.
 * GET /ai/suggest-related/{taskId}
 * Returns: array of related task suggestions
 * Caches results for 1 hour by taskId
 * @param {string|number} taskId
 * @returns {Promise<Array>} related tasks
 */
export async function suggestRelatedTasks(taskId) {
  if (!taskId) throw new Error('taskId is required')

  // check cache
  const cached = relatedCache.get(taskId)
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.value

  try {
    const data = await requestWithRetry({ method: 'get', url: `/ai/suggest-related/${taskId}` })
    if (!Array.isArray(data)) throw new Error('Invalid response from suggestRelatedTasks: expected array')
    // store in cache
    relatedCache.set(taskId, { ts: Date.now(), value: data })
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'AI suggestRelatedTasks failed'
    throw new Error(message)
  }
}

/**
 * Back-compat helper used by older UI: generateTaskSuggestions(prompt)
 * POST /ai/suggestions
 * @param {string} prompt
 * @returns {Promise<Array>} array of suggestion strings/objects
 */
export async function generateTaskSuggestions(prompt) {
  if (!prompt || typeof prompt !== 'string') throw new Error('prompt string is required')
  try {
    const data = await requestWithRetry({ method: 'post', url: '/ai/suggestions', data: { prompt } })
    if (!Array.isArray(data)) throw new Error('Invalid response from AI suggestions endpoint')
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'AI generateTaskSuggestions failed'
    throw new Error(message)
  }
}

export default {
  analyzeTask,
  suggestRelatedTasks,
  generateTaskSuggestions,
}
