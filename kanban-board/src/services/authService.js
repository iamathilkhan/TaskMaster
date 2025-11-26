import api from './api'

export const login = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export const signup = async (payload) => {
  const { data } = await api.post('/auth/signup', payload)
  return data
}

export default {
  login,
  signup,
}
