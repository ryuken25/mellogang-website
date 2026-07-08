import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { demoUsers } from '../data/demoUserData'

const AuthContext = createContext(null)
export const AUTH_STORAGE_KEY = 'mellogang_auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY)
      setUser(saved ? JSON.parse(saved) : null)
    } catch { setUser(null) }
    setIsHydrated(true)
  }, [])

  const persist = (nextUser) => {
    setUser(nextUser)
    if (nextUser) localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser))
    else localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const login = async (email, password) => {
    const demo = demoUsers.find(u => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password)
    if (!demo) throw new Error('Email atau password tidak cocok. Untuk demo, gunakan dummy@dummy.com / dummy.')
    const { password: _password, ...safeUser } = demo
    const existing = (() => { try { return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) || 'null') } catch { return null } })()
    const nextUser = { ...safeUser, ...(existing?.email === safeUser.email ? existing : {}), loggedInAt: new Date().toISOString() }
    persist(nextUser)
    return nextUser
  }

  const logout = () => persist(null)
  const updateProfile = (data) => {
    const next = { ...(user || {}), ...data, updatedAt: new Date().toISOString() }
    persist(next)
    return next
  }

  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), isHydrated, login, logout, updateProfile }), [user, isHydrated])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function useLogoutToHome() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return () => { logout(); navigate('/') }
}
