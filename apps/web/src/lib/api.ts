const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/v1'
const ACCESS_KEY = 'menoowel.access'

let accessToken: string | null = localStorage.getItem(ACCESS_KEY)

export function setAccessToken(token: string | null) {
  accessToken = token
  if (token) localStorage.setItem(ACCESS_KEY, token)
  else localStorage.removeItem(ACCESS_KEY)
}
export const getAccessToken = () => accessToken

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

async function tryRefresh(): Promise<boolean> {
  try {
    const r = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (!r.ok) return false
    const d = await r.json()
    setAccessToken(d.accessToken)
    return true
  } catch {
    return false
  }
}

async function request<T>(path: string, opts: RequestInit = {}, retry = true): Promise<T> {
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string>) }
  if (opts.body) headers['Content-Type'] = 'application/json'
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`

  const res = await fetch(`${BASE}${path}`, { ...opts, headers, credentials: 'include' })
  if (res.status === 401 && retry && (await tryRefresh())) return request<T>(path, opts, false)
  if (!res.ok) throw new ApiError(res.status, await res.text().catch(() => res.statusText))
  if (res.status === 204) return null as T
  return res.json() as Promise<T>
}

export const api = {
  get: <T>(p: string) => request<T>(p),
  post: <T>(p: string, body?: unknown) => request<T>(p, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(p: string, body?: unknown) => request<T>(p, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  del: <T>(p: string) => request<T>(p, { method: 'DELETE' }),
}
