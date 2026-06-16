import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, setAccessToken, getAccessToken } from '../lib/api'

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: 'USER' | 'ADMIN'
}

interface AuthCtx {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  loginWithGoogle: () => void
}

const Ctx = createContext<AuthCtx | null>(null)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Capture Google redirect token (#access_token=...) then hydrate session.
    const hash = window.location.hash
    if (hash.startsWith('#access_token=')) {
      setAccessToken(decodeURIComponent(hash.slice('#access_token='.length)))
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    ;(async () => {
      try {
        if (getAccessToken()) setUser(await api.get<AuthUser>('/auth/me'))
      } catch {
        setAccessToken(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handle = (data: { user: AuthUser; accessToken: string }) => {
    setAccessToken(data.accessToken)
    setUser(data.user)
  }

  const value: AuthCtx = {
    user,
    loading,
    login: async (email, password) => handle(await api.post('/auth/login', { email, password })),
    register: async (email, password, name) => handle(await api.post('/auth/register', { email, password, name })),
    logout: async () => {
      await api.post('/auth/logout').catch(() => {})
      setAccessToken(null)
      setUser(null)
    },
    loginWithGoogle: () => {
      window.location.href = `${API_BASE}/auth/google`
    },
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
