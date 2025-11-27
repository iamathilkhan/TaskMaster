import api from './api'

/**
 * Task service — helpers to operate on tasks using the central api axios instance
 * Supports pagination and returns structured responses when setLoading is provided
 */

/**
 * @typedef {object} ServiceResponse
 * @property {boolean} success
 * @property {any} [data]
 * @property {string} [error]
 * @property {object} [meta]
 * @property {boolean} [loading]
 */

function formatResponse(success, data = null, error = null, meta = null, loading = false) {
  const res = { success }
  if (data !== null) res.data = data
  if (error) res.error = error
  if (meta) res.meta = meta
  if (typeof loading === 'boolean') res.loading = loading
  return res
}

/**
 * GET /tasks?board={boardId}&page={page}&limit={limit}
 * Fetch tasks for a board (paginated)
 * @param {string|number} boardId
 * @param {{page?:number, limit?:number, setLoading?:function}} [opts]
 * @returns {Promise<ServiceResponse|any>}
 */
export async function getTasksByBoard(boardId, opts = {}) {
  const { page = 1, limit = 50, setLoading } = opts || {}
  if (!boardId) throw new Error('boardId is required')
  if (setLoading) setLoading(true)
  try {
    const params = { board: boardId, page, limit }
    const { data } = await api.get('/tasks', { params })
    // normalize common patterns: { items, tasks } or raw array
    const payload = data?.items ?? data?.tasks ?? data
    const meta = data?.meta ?? data?.pagination ?? null
    if (setLoading) return formatResponse(true, payload, null, meta, false)
    return payload
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to fetch tasks'
    if (setLoading) return formatResponse(false, null, message, null, false)
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * GET /tasks/{id}
 * Fetch single task by id
 * @param {string|number} id
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResponse|any>}
 */
export async function getTaskById(id, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('task id is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.get(`/tasks/${id}`)
    if (setLoading) return formatResponse(true, data, null, null, false)
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to fetch task ${id}`
    if (setLoading) return formatResponse(false, null, message, null, false)
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * POST /tasks
 * Create a new task
 * @param {{title:string,description?:string,boardId:string|number,priority?:string,dueDate?:string}} payload
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResponse|any>}
 */
export async function createTask(payload, opts = {}) {
  const { setLoading } = opts || {}
  if (!payload || !payload.title || !payload.boardId) throw new Error('payload must include title and boardId')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.post('/tasks', payload)
    if (setLoading) return formatResponse(true, data, null, null, false)
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to create task'
    if (setLoading) return formatResponse(false, null, message, null, false)
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * PUT /tasks/{id}
 * Update a task
 * @param {string|number} id
 * @param {object} patch
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResponse|any>}
 */
export async function updateTask(id, patch, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('task id is required')
  if (!patch || typeof patch !== 'object') throw new Error('patch object is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.put(`/tasks/${id}`, patch)
    if (setLoading) return formatResponse(true, data, null, null, false)
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to update task ${id}`
    if (setLoading) return formatResponse(false, null, message, null, false)
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * DELETE /tasks/{id}
 * Delete a task
 * @param {string|number} id
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResponse|any>}
 */
export async function deleteTask(id, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('task id is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.delete(`/tasks/${id}`)
    if (setLoading) return formatResponse(true, data, null, null, false)
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to delete task ${id}`
    if (setLoading) return formatResponse(false, null, message, null, false)
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * PUT /tasks/{id}/status
 * Change a task's status
 * @param {string|number} id
 * @param {string} newStatus
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResponse|any>}
 */
export async function moveTask(id, newStatus, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('task id is required')
  if (!newStatus) throw new Error('newStatus is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.put(`/tasks/${id}/status`, { status: newStatus })
    if (setLoading) return formatResponse(true, data, null, null, false)
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to move task ${id}`
    if (setLoading) return formatResponse(false, null, message, null, false)
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

// backward compatible alias used in many places in the codebase
export const fetchTasks = getTasksByBoard

export default {
  getTasksByBoard,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  fetchTasks,
}
