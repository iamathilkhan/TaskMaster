import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuthToken } from '../services/api'

export default function Dashboard() {
  const nav = useNavigate()

  function handleLogout() {
    // clear token and redirect to login
    localStorage.removeItem('authToken')
    clearAuthToken()
    nav('/login')
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>Dashboard (placeholder)</h2>
        <div>
          <button onClick={handleLogout} style={{padding:8, borderRadius:8, background:'#ef4444', color:'#fff', border:'none', cursor:'pointer'}}>Log out</button>
        </div>
      </div>
    </div>
  )
}
