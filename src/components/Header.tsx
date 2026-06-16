import { useT } from '../i18n/LanguageContext'

export function Header() {
  const { t, lang, setLang } = useT()
  return (
    <header className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-center gap-1 sm:items-start">
        <img
          src="/img/Logo Dark v1.png"
          alt="MENOOWEL — BrewLab Studio"
          className="h-14 w-auto sm:h-16"
          width={4859}
          height={2040}
        />
        <p className="text-center text-xs text-coffee-300 sm:text-left">{t('appTagline')}</p>
      </div>
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
    </header>
  )
}
