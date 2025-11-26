import api from './api'

export const fetchTasks = async (boardId) => {
  const { data } = await api.get(`/boards/${boardId}/tasks`)
  return data
}

export const createTask = async (boardId, task) => {
  const { data } = await api.post(`/boards/${boardId}/tasks`, task)
  return data
}

export default {
  fetchTasks,
  createTask,
}
