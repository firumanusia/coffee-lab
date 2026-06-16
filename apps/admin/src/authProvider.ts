import type { AuthProvider } from 'react-admin'
import { BASE, getToken, setToken } from './http'

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    })
    if (!res.ok) throw new Error('Invalid credentials')
    const data = await res.json()
    if (data.user?.role !== 'ADMIN') throw new Error('Admin access only')
    setToken(data.accessToken)
  },
  logout: async () => {
    await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
    setToken(null)
  },
  checkAuth: async () => {
    if (!getToken()) throw new Error('Not authenticated')
    const res = await fetch(`${BASE}/auth/me`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    const me = res.ok ? await res.json() : null
    if (!me || me.role !== 'ADMIN') throw new Error('Admin access only')
  },
  checkError: async (error) => {
    if (error?.status === 401 || error?.status === 403) {
      setToken(null)
      throw new Error('Session expired')
    }
  },
  getIdentity: async () => {
    const res = await fetch(`${BASE}/auth/me`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    const me = await res.json()
    return { id: me.id, fullName: me.name || me.email }
  },
  getPermissions: async () => 'admin',
}
