import { GRINDERS, suggestSetting } from '../../data/generated/grinders'
import { MICRON_RANGE, grindBandFor } from '../../data/grindChart'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select, Slider } from '../ui'
import { Icons } from '../icons'

export function GrindPanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update } = store

  const grinder = GRINDERS.find((g) => g.id === config.grinderId) ?? GRINDERS[0]
  const band = grindBandFor(config.micron)
  const setting = suggestSetting(grinder, config.micron)

  // clamp the micron slider to this grinder's usable range
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
