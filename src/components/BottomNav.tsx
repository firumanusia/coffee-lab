import { useT } from '../i18n/LanguageContext'
import { STR } from '../i18n/strings'

export interface TabDef {
  id: string
  icon: string
  label: keyof typeof STR
}

export function BottomNav({ tabs, active, onSelect }: { tabs: TabDef[]; active: string; onSelect: (id: string) => void }) {
  const { t } = useT()
  return (
    <nav
      className="border-t border-coffee-800 bg-coffee-950/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-5">
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-semibold transition ${
                isActive ? 'text-crema' : 'text-coffee-400'
              }`}
            >
              <span className={`text-xl leading-none transition ${isActive ? 'scale-110' : ''}`} aria-hidden>
                {tab.icon}
              </span>
              {t(tab.label)}
              <span className={`mt-0.5 h-0.5 w-6 rounded-full transition ${isActive ? 'bg-coffee-400' : 'bg-transparent'}`} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
