import { predict } from '../../model/predict'
import { useGear } from '../../catalog/CatalogContext'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel } from '../ui'
import { Icons } from '../icons'
import { SCAChart } from './SCAChart'
import { ShareButton } from '../ShareButton'

export function ResultCards({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update } = store
  const p = predict(config, useGear(config))

  return (
    <Panel title={t('secResults')} icon={<Icons.results size={16} />}>
      {p.source !== 'measured' && (
        <p className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] text-amber-300 [.light_&]:text-amber-800">
          {t('estimateNote')}
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 text-center">
        <Metric label={t('yield')} value={`${Math.round(p.beverageMass)}`} unit="g" />
        <Metric label={t('tds')} value={p.tds.toFixed(2)} unit="%" highlight={p.source === 'measured'} />
        <Metric label={t('ey')} value={p.ey.toFixed(1)} unit="%" />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
        <Metric label={t('brewTime')} value={fmt(p.brewTimeSec)} small />
        <Metric label={t('flowRate')} value={`${p.flowRate}`} unit="g/s" small />
      </div>

      <div className="mt-3 rounded-xl border border-coffee-800/60 bg-coffee-900/30 p-3">
        <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-crema">
          <input
            type="checkbox"
            checked={config.useMeasured}
            onChange={(e) => update({ useMeasured: e.target.checked })}
          />
          {t('useMeasured')}
        </label>
        {config.useMeasured && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="field-label">{t('measuredTds')}</span>
              <input
                type="number"
                step={0.01}
                className="input px-2 py-1"
                value={config.measuredTds ?? ''}
                placeholder="1.35"
                onChange={(e) => update({ measuredTds: e.target.value ? Number(e.target.value) : undefined })}
              />
            </label>
            <label className="text-xs">
              <span className="field-label">{t('measuredYield')} (g)</span>
              <input
                type="number"
                step={1}
                className="input px-2 py-1"
                value={config.measuredYield ?? ''}
                placeholder={`${Math.round(p.beverageMass)}`}
                onChange={(e) => update({ measuredYield: e.target.value ? Number(e.target.value) : undefined })}
              />
            </label>
          </div>
        )}
      </div>

      <div className="mt-3 text-center text-[11px] uppercase tracking-wide text-coffee-400">
        {t('secChart')} · {p.source === 'measured' ? t('measured') : t('predicted')}
      </div>
      <SCAChart ey={p.ey} tds={p.tds} source={p.source} />

      <ul className="mt-2 space-y-1">
        {p.hints.map((h, i) => (
          <li key={i} className="rounded-lg bg-coffee-900/40 px-3 py-1.5 text-xs text-coffee-200">
            {L(h)}
          </li>
        ))}
      </ul>

      <ShareButton store={store} />
    </Panel>
  )
}

function Metric({ label, value, unit, small, highlight }: { label: string; value: string; unit?: string; small?: boolean; highlight?: boolean }) {
  return (
    <div className={`metric ${highlight ? 'ring-1 ring-brand-teal/70' : ''}`}>
      <div className={small ? 'text-lg font-bold text-crema' : 'metric-value'}>
        {value}
        {unit && <span className="text-xs font-medium text-coffee-300"> {unit}</span>}
      </div>
      <div className="metric-label">{label}</div>
    </div>
  )
}

function fmt(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}
