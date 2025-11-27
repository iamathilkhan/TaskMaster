import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { selectIsAuthenticated, selectLoading } from '../../redux/slices/authSlice'

export default function PrivateRoute({ children }) {
  const loading = useSelector(selectLoading)
  const authenticated = useSelector(selectIsAuthenticated)

  if (loading) {
    return (
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'40vh'}}>
        <div style={{width:28, height:28, borderRadius:999, border:'3px solid rgba(0,0,0,0.08)', borderTopColor:'#111827', animation:'spin 700ms linear infinite'}} />
        <style>{`@keyframes spin { from { transform:rotate(0) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!authenticated) return <Navigate to="/login" replace />

  return children
}

PrivateRoute.propTypes = { children: PropTypes.node }
