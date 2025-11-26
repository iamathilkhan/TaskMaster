import { useState } from 'react'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Placeholder sign-in/out
  const signIn = async () => { setLoading(true); setTimeout(()=>{ setUser({id:'u1', name:'Demo User'}); setLoading(false) }, 300) }
  const signOut = () => { setUser(null) }

  return { user, loading, signIn, signOut }
}
