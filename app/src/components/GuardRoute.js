import axios from 'axios'

import { useState } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

function GuardRoute(props) {
  const guest = !!props.guest
  const user = !!props.user
  const redirect = props.redirect

  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  ;(async () => {
    try {
      await axios.get('/auth/authenticate')
      setIsAuthenticated(true)
    } catch (e) {
      setIsAuthenticated(false)
    }
    setLoading(false)
  })()

  if (loading) return

  if (guest) {
    return isAuthenticated ? <Navigate to={ redirect } /> : <Outlet />
  } 

  if (user) {
    return isAuthenticated ? <Outlet /> : <Navigate to={ redirect } />
  }

  return <Outlet />
}

export default GuardRoute