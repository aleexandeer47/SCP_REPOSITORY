import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authService from '../services/authService'
import { setAuthInvalidHandler } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => setUser(null), [])

  // If any request comes back 401/403, the cookie is gone or rejected —
  // drop the cached user so ProtectedRoute sends them back to /login.
  useEffect(() => {
    setAuthInvalidHandler(clearSession)
    return () => setAuthInvalidHandler(null)
  }, [clearSession])

  // The httpOnly cookie is the actual source of truth, not any client-side
  // state — on load we ask the backend whether it still considers us logged in.
  useEffect(() => {
    authService
      .getSession()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      async login(credentials) {
        const nextUser = await authService.login(credentials)
        setUser(nextUser)
        return nextUser
      },
      async logout() {
        // Best-effort: even if the network call fails (server down, offline),
        // still drop the local session so the user lands back on /login
        // instead of the click silently doing nothing.
        try {
          await authService.logout()
        } catch {
          // ignored — clearSession() below is what actually matters
        } finally {
          clearSession()
        }
      },
    }),
    [user, loading, clearSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
