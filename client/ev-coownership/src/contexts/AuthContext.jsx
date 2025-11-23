import React, { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { mockLogin } from '../mocks/mockData'

const AuthContext = createContext(null)
export function useAuth() { return useContext(AuthContext) }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('ev_user')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  function login(email) {
    // Replace with real API call
    const u = mockLogin(email)
    sessionStorage.setItem('ev_user', JSON.stringify(u))
    sessionStorage.setItem('ev_token', 'demo-token')
    setUser(u)
    return u
  }
  function logout() {
    sessionStorage.removeItem('ev_user')
    sessionStorage.removeItem('ev_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node }