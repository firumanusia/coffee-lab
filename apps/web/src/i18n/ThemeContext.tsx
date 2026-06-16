import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'
const LS_KEY = 'brewlab.theme'

interface ThemeCtx {
  theme: Theme
  toggle: () => void
}
const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(LS_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'light'
  })

  useEffect(() => {
    localStorage.setItem(LS_KEY, theme)
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <Ctx.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
