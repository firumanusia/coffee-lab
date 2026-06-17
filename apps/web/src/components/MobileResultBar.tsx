import { predict } from '../model/predict'
import { extractionOf, strengthOf } from '../model/sca'
import { useGear } from '../catalog/CatalogContext'
import { useT } from '../i18n/LanguageContext'
import type { BrewStore } from '../store/useBrewStore'

const zoneColor = (ok: boolean) => (ok ? 'text-brand-tealLight' : 'text-amber-400 [.light_&]:text-amber-700')

export function MobileResultBar({ store, onOpen, active }: { store: BrewStore; onOpen: () => void; active: boolean }) {
  const { t } = useT()
  const p = predict(store.config, useGear(store.config))
  const eyOk = extractionOf(p.ey) === 'ideal'
  const tdsOk = strengthOf(p.tds) === 'ideal'

  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center justify-between gap-3 border-t border-coffee-800 bg-coffee-900/95 px-4 py-1.5 text-left backdrop-blur"
    >
      <span className="flex gap-4 text-xs">
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] uppercase tracking-wide text-coffee-400">{t('yield')}</span>
          <span className="font-bold text-crema">{Math.round(p.beverageMass)}g</span>
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] uppercase tracking-wide text-coffee-400">{t('tds')}</span>
          <span className={`font-bold ${zoneColor(tdsOk)}`}>{p.tds.toFixed(2)}%</span>
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[9px] uppercase tracking-wide text-coffee-400">{t('ey')}</span>
          <span className={`font-bold ${zoneColor(eyOk)}`}>{p.ey.toFixed(1)}%</span>
        </span>
      </span>
      {!active && (
        <span className="rounded-full border border-coffee-700 px-2 py-0.5 text-[10px] text-coffee-300">
          {p.source === 'measured' ? t('measured') : t('predicted')} ↗
        </span>
      )}
    </button>
  )
}
