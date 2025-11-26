import api from './api'

export const fetchBoards = async () => {
  // placeholder — replace with real endpoints
  const { data } = await api.get('/boards')
  return data
}

export const createBoard = async (board) => {
  const { data } = await api.post('/boards', board)
  return data
}

export default {
  fetchBoards,
  createBoard
}
