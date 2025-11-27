import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, logoutUser, registerUser, refreshToken, selectUser, selectIsAuthenticated, selectLoading } from '../redux/slices/authSlice'

/**
 * useAuth hook — exposes the current user and auth helpers backed by redux
 * API:
 *  - user, isAuthenticated, loading, error
 *  - login({email,password,remember}), register({name,email,password}), logout(), refresh()
 */
export default function useAuth() {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectLoading)

  const login = useCallback(async ({ email, password, remember = false }) => {
    try {
      const res = await dispatch(loginUser({ email, password, remember }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) {
      // normalized message
      throw err?.message || err?.toString()
    }
  }, [dispatch])

  const register = useCallback(async ({ name, email, password }) => {
    try {
      const res = await dispatch(registerUser({ name, email, password }))
      if (res.error) throw res.error
      return res.payload
    } catch (err) {
      throw err?.message || err?.toString()
    }
  }, [dispatch])

  const logout = useCallback(async () => {
    await dispatch(logoutUser())
  }, [dispatch])

  const refresh = useCallback(async () => {
    try {
      const res = await dispatch(refreshToken())
      if (res.error) throw res.error
      return res.payload
    } catch (err) {
      throw err?.message || err?.toString()
    }
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    refresh,
  }
}

// PropTypes attached for documentation (hooks don't validate runtime like components)
useAuth.propTypes = {
  // no props — this is a hook; kept for docs and linter clarity
}
import { useState } from 'react'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Placeholder sign-in/out
  const signIn = async () => { setLoading(true); setTimeout(()=>{ setUser({id:'u1', name:'Demo User'}); setLoading(false) }, 300) }
  const signOut = () => { setUser(null) }

  return { user, loading, signIn, signOut }
}
