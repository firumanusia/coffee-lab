import { useEffect, useState } from 'react'

/** Reactive CSS media-query match (SSR-safe-ish; window assumed in browser). */
export function useMediaQuery(query: string): boolean {
  const [match, setMatch] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const m = window.matchMedia(query)
    const handler = () => setMatch(m.matches)
    handler()
    m.addEventListener('change', handler)
    return () => m.removeEventListener('change', handler)
  }, [query])

  return match
}
