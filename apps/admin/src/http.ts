const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'
const KEY = 'menoowel.admin.access'

export const getToken = () => localStorage.getItem(KEY)
export const setToken = (t: string | null) => (t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY))

async function refresh(): Promise<boolean> {
  try {
    const r = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (!r.ok) return false
    setToken((await r.json()).accessToken)
    return true
  } catch {
    return false
  }
}

export async function http<T>(path: string, opts: RequestInit = {}, retry = true): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string>) }
  if (opts.body) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...opts, headers, credentials: 'include' })
  if (res.status === 401 && retry && (await refresh())) return http<T>(path, opts, false)
  if (!res.ok) throw new Error(`${res.status}`)
  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

export { BASE }
