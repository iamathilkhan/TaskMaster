import axios from 'axios'

// Basic axios instance — replace baseURL with your API endpoint when ready
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  headers: { 'Content-Type': 'application/json' }
})

export default api
