import type { ReactNode } from 'react'
import { useT } from '../i18n/LanguageContext'
import { useTheme } from '../i18n/ThemeContext'
import { AuthControls } from '../auth/AuthControls'
import { SupportButton } from './SupportButton'
import { Icons } from './icons'

export function Header({ compact = false, actions }: { compact?: boolean; actions?: ReactNode }) {
  const { t, lang, setLang } = useT()
  const { theme, toggle } = useTheme()
  return (
    <header
      className={`flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between ${compact ? 'mb-3' : 'mb-6'}`}
    >
      <div className="flex flex-col items-center gap-1 sm:items-start">
        <img
          src={theme === 'light' ? '/img/Logo Light v2.png' : '/img/Logo Dark v2.png'}
          alt="MENOOWEL — BrewLab Studio"
          className={compact ? 'h-9 w-auto' : 'h-14 w-auto sm:h-16'}
          width={4859}
          height={2040}
        />
        {!compact && <p className="text-center text-xs text-coffee-300 sm:text-left">{t('appTagline')}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <SupportButton />
        <AuthControls />
        <button
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="grid h-8 w-8 place-items-center rounded-lg border border-coffee-800 text-coffee-200 transition hover:border-brand-teal hover:text-crema"
        >
          {theme === 'dark' ? <Icons.sun size={16} /> : <Icons.moon size={16} />}
        </button>
        <div className="inline-flex overflow-hidden rounded-lg border border-coffee-800 text-sm">
        {(['id', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 font-semibold transition ${
              lang === l ? 'bg-brand-red text-white' : 'text-coffee-200 hover:bg-coffee-900/60'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
        </div>
      </div>
    </header>
  )
}
