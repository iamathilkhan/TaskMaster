import api from './api'

/**
 * @typedef {object} ServiceResult
 * @property {boolean} success
 * @property {any} [data]
 * @property {string} [error]
 * @property {boolean} [loading]
 */

/**
 * Fetch all boards
 * @param {{setLoading?:function}} [opts] optional callbacks (setLoading)
 * @returns {Promise<ServiceResult|any>} returns the boards array (legacy) or a ServiceResult when opts provided
 */
export async function getAllBoards(opts = {}) {
  const { setLoading } = opts || {}
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.get('/boards')
    // if caller passed a loading handler return structured response
    if (setLoading) return { success: true, data, loading: false }
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to fetch boards'
    if (setLoading) return { success: false, error: message, loading: false }
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Fetch a single board by id
 * @param {string|number} id
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResult|any>}
 */
export async function getBoardById(id, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('Board id is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.get(`/boards/${id}`)
    if (setLoading) return { success: true, data, loading: false }
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to fetch board ${id}`
    if (setLoading) return { success: false, error: message, loading: false }
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Create a new board
 * @param {{title:string,description?:string}} payload
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResult|any>}
 */
export async function createBoard(payload, opts = {}) {
  const { setLoading } = opts || {}
  if (!payload || !payload.title) throw new Error('Board payload must include a title')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.post('/boards', payload)
    if (setLoading) return { success: true, data, loading: false }
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Failed to create board'
    if (setLoading) return { success: false, error: message, loading: false }
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Update existing board
 * @param {string|number} id
 * @param {object} patch
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResult|any>}
 */
export async function updateBoard(id, patch, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('Board id is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.put(`/boards/${id}`, patch)
    if (setLoading) return { success: true, data, loading: false }
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to update board ${id}`
    if (setLoading) return { success: false, error: message, loading: false }
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Delete a board
 * @param {string|number} id
 * @param {{setLoading?:function}} [opts]
 * @returns {Promise<ServiceResult|any>}
 */
export async function deleteBoard(id, opts = {}) {
  const { setLoading } = opts || {}
  if (!id) throw new Error('Board id is required')
  if (setLoading) setLoading(true)
  try {
    const { data } = await api.delete(`/boards/${id}`)
    if (setLoading) return { success: true, data, loading: false }
    return data
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || `Failed to delete board ${id}`
    if (setLoading) return { success: false, error: message, loading: false }
    throw new Error(message)
  } finally {
    if (setLoading) setLoading(false)
  }
}

// backward-compat aliases (previous code used fetchBoards/createBoard/etc.)
export const fetchBoards = getAllBoards

export default {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
  fetchBoards,
}
