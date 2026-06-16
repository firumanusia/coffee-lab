import { useEffect, useState } from 'react'
import { MICRON_RANGE, grindBandFor } from '../../data/grindChart'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select, Slider } from '../ui'
import { Icons } from '../icons'

// The grinder catalog (227 entries with notes) is the heaviest data module, so
// it is code-split and loaded on demand to keep the initial bundle light.
type GrinderModule = typeof import('../../data/generated/grinders')

export function GrindPanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update } = store
  const [mod, setMod] = useState<GrinderModule | null>(null)

  useEffect(() => {
    let alive = true
    import('../../data/generated/grinders').then((m) => alive && setMod(m))
    return () => {
      alive = false
    }
  }, [])

  if (!mod) {
    return (
      <Panel title={t('secGrind')} icon={<Icons.grind size={16} />}>
        <div className="animate-pulse space-y-2">
          <div className="h-9 rounded-lg bg-coffee-900/50" />
          <div className="h-6 rounded-lg bg-coffee-900/40" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 rounded-xl bg-coffee-900/40" />
            <div className="h-14 rounded-xl bg-coffee-900/40" />
            <div className="h-14 rounded-xl bg-coffee-900/40" />
          </div>
        </div>
      </Panel>
    )
  }

  const { GRINDERS, suggestSetting } = mod
  const grinder = GRINDERS.find((g) => g.id === config.grinderId) ?? GRINDERS[0]
  const band = grindBandFor(config.micron)
  const setting = suggestSetting(grinder, config.micron)

  const min = Math.max(MICRON_RANGE.min, grinder.minMicron || MICRON_RANGE.min)
  const max = Math.min(MICRON_RANGE.max + 200, grinder.maxMicron || MICRON_RANGE.max)

  return (
    <Panel title={t('secGrind')} icon={<Icons.grind size={16} />}>
      <Select
        label={t('grinderModel')}
        value={config.grinderId}
        options={GRINDERS.map((g) => ({ value: g.id, label: `${g.brand} ${g.model}` }))}
        onChange={(grinderId) => update({ grinderId })}
      />
      <Slider
        label={t('targetMicron')}
        value={Math.min(max, Math.max(min, config.micron))}
        min={min}
        max={max}
        step={10}
        suffix={t('micron')}
        onChange={(v) => update({ micron: v })}
      />
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="metric">
          <div className="metric-value text-base">{L(band.name)}</div>
          <div className="metric-label">{t('category')}</div>
        </div>
        <div className="metric">
          <div className="metric-value text-base">{setting === null ? '—' : `~${setting}`}</div>
          <div className="metric-label">{grinder.stepless ? t('stepless') : t('clicks')}</div>
        </div>
        <div className="metric">
          <div className="metric-value text-base">
            {grinder.minMicron}–{grinder.maxMicron}
          </div>
          <div className="metric-label">{t('range')} µm</div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-coffee-400">
        {grinder.stepType}
        {grinder.totalSteps ? ` · ${grinder.totalSteps}` : ''}
        {grinder.umPerStep ? ` · ~${grinder.umPerStep}µm/${t('clicks').toLowerCase()}` : ''}
      </p>
      {grinder.note && <p className="mt-1 text-[11px] text-coffee-400">{grinder.note}</p>}
    </Panel>
  )
}
