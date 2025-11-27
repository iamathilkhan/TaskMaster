import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import api, { setAuthToken } from '../services/api'
import styles from './Signup.module.css'

export default function Signup({ onSignupSuccess }) {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate() {
    const e = {}
    if (!name) e.name = 'Name is required'
    if (!email) e.email = 'Email is required'
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!re.test(email)) e.email = 'Enter a valid email address'
    }
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const res = await api.post('/auth/signup', { name, email, password })
      const data = res?.data
      if (!data) throw new Error('Unexpected response')

      const token = data?.token || data?.auth?.token
      if (token) {
        localStorage.setItem('authToken', token)
        setAuthToken(token)
      }

      if (onSignupSuccess) onSignupSuccess(data)
      nav('/dashboard')
    } catch (err) {
      setErrors({ form: err?.response?.data?.message || err?.message || 'Signup failed' })
    } finally { setLoading(false) }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create account</h1>
        <div className={styles.subtitle}>Start with your name and email</div>

        {errors.form && <div className={styles.error}>{errors.form}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Full name</label>
            <input className={styles.input} value={name} onChange={e=>setName(e.target.value)} />
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} value={email} onChange={e=>setEmail(e.target.value)} type="email" />
            {errors.email && <div className={styles.error}>{errors.email}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} value={password} onChange={e=>setPassword(e.target.value)} type="password" />
            {errors.password && <div className={styles.error}>{errors.password}</div>}
          </div>

          <div className={styles.actions}>
            <div className={styles.helper}>Already registered? <Link to="/login" className={styles.link}>Sign in</Link></div>
            <div>
              <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

Signup.propTypes = { onSignupSuccess: PropTypes.func }
Signup.defaultProps = { onSignupSuccess: null }
