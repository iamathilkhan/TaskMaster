import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './redux/store'
import KanbanBoard from './components/Board/KanbanBoard'
import Dashboard from './pages/Dashboard'
import BoardDetail from './pages/BoardDetail'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ProtectedLayout from './components/Layout/ProtectedLayout'
import ErrorBoundary from './components/ErrorBoundary'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PrivateRoute from './components/Auth/PrivateRoute'
import './styles/globals.css'

export default function App() {
  // initialize auth token header from localStorage so API calls have Authorization set
  React.useEffect(() => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        // lazy require to avoid circular imports in some setups
        const { setAuthToken } = require('./services/api')
        setAuthToken(token)
      }
    } catch (err) {
      // ignore
    }
  }, [])
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* public home */}
        <Route path="/" element={<Home />} />

        {/* protected area layout (navbar + sidebar) */}
        <Route element={<PrivateRoute><ProtectedLayout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/board" element={<KanbanBoard />} />
          <Route path="/board/:id" element={<BoardDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  )
}
