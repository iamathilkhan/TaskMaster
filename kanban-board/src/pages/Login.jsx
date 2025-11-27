import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import api, { setAuthToken } from '../services/api'
import styles from './Login.module.css'

export default function Login({ onLoginSuccess }) {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function validate() {
    const e = {}
    if (!email) e.email = 'Email is required'
    else {
      // simple email regex
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(email)) e.email = 'Enter a valid email address'
    }
    if (!password) e.password = 'Password is required'
    setError(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/auth/login', { email, password, remember })
      // Expected response: { token, user }
      const data = res?.data
      // For demo, if no data returned, fake success
      if (!data) throw new Error('Empty response from server')

      // call optional handler
      if (onLoginSuccess) onLoginSuccess(data)

      // persist token and set default auth header for subsequent requests
      const token = data?.token || data?.auth?.token
      if (token) {
        localStorage.setItem('authToken', token)
        setAuthToken(token)
      }

      // navigate to dashboard on success
      nav('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please try again.'
      setError({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Sign in</h1>
        <div className={styles.subtitle}>Welcome back — enter your credentials</div>

        {error?.form && <div className={styles.error}>{error.form}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={email} onChange={e=>setEmail(e.target.value)} type="email" aria-label="email" />
            {error?.email && <div className={styles.error}>{error.email}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div style={{display:'flex', gap:6}}>
              <input className={styles.input} value={password} onChange={e=>setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} aria-label="password" />
              <button type="button" className={styles.toggleBtn} onClick={()=>setShowPassword(s=>!s)} aria-label="toggle password visibility">{showPassword ? 'Hide' : 'Show'}</button>
            </div>
            {error?.password && <div className={styles.error}>{error.password}</div>}
          </div>

          <div className={styles.row} style={{marginBottom:12}}>
            <label className={styles.checkbox}><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me</label>
            <div className={styles.helper}><Link to="#" className={styles.link}>Forgot password?</Link></div>
          </div>

          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <button className={styles.btn} type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
            <div className={styles.helper}>New here? <Link to="/signup" className={styles.link}>Sign up</Link></div>
          </div>

        </form>

        <div className={styles.footer}>
          <div className={styles.helper}>Or continue with SSO (stub)</div>
          <div className={styles.helper}>Privacy · Terms</div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  onLoginSuccess: PropTypes.func,
}

Login.defaultProps = { onLoginSuccess: null }
