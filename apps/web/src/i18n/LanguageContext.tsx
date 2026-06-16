import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STR, type Lang } from './strings'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: keyof typeof STR) => string
}

const Ctx = createContext<LangCtx | null>(null)
const LS_KEY = 'brewlab.lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem(LS_KEY)
    return saved === 'en' || saved === 'id' ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem(LS_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t: (key) => STR[key]?.[lang] ?? String(key),
    }),
    [lang],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useT() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useT must be used within LanguageProvider')
  return ctx
}

/** Pick the localized string from a {id,en} pair. */
export function useLocalized() {
  const { lang } = useT()
  return (pair: { id: string; en: string }) => pair[lang]
}
