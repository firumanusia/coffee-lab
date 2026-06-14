import { useT } from '../i18n/LanguageContext'

export function Header() {
  const { t, lang, setLang } = useT()
  return (
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-coffee-500 text-2xl text-coffee-950">☕</div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-crema">{t('appTitle')}</h1>
          <p className="text-xs text-coffee-300">{t('appTagline')}</p>
        </div>
      </div>
      <div className="inline-flex overflow-hidden rounded-lg border border-coffee-800 text-sm">
        {(['id', 'en'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1.5 font-semibold transition ${
              lang === l ? 'bg-coffee-500 text-coffee-950' : 'text-coffee-200 hover:bg-coffee-900/60'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>
    </header>
  )
}
