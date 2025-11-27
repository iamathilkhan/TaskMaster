import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { logoutUser } from '../../redux/slices/authSlice'
import { clearAuthToken } from '../../services/api'

export default function Navbar() {
  const dispatch = useDispatch()
  const nav = useNavigate()

  function handleLogout() {
    dispatch(logoutUser())
    localStorage.removeItem('authToken')
    clearAuthToken()
    nav('/login')
  }

  return (
    <nav style={{padding: 12, borderBottom: '1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <strong>TaskMaster AI</strong>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/">Board</Link>
      </div>

      <div style={{display:'flex', gap:10, alignItems:'center'}}>
        <Link to="/profile">Profile</Link>
        <button onClick={handleLogout} className="logoutBtn" style={{padding:6, borderRadius:6, border:'none', cursor:'pointer'}}>Log out</button>
      </div>
    </nav>
  )
}
