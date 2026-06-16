import { GRINDERS, suggestSetting } from '../../data/grinders'
import { MICRON_RANGE, grindBandFor } from '../../data/grindChart'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { ChipGroup, Panel, Select, Slider } from '../ui'
import { Icons } from '../icons'

export function GrindPanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update } = store

  const grinder = GRINDERS.find((g) => g.id === config.grinderId) ?? GRINDERS[0]
  const band = grindBandFor(config.micron)
  const setting = suggestSetting(grinder, config.micron)

  const typeOf = (g: (typeof GRINDERS)[number]) => g.type
  const filtered = GRINDERS.filter((g) => typeOf(g) === grinder.type)

  return (
    <Panel title={t('secGrind')} icon={<Icons.grind size={16} />}>
      <ChipGroup
        label={t('grinderType')}
        value={grinder.type}
        options={[
          { value: 'hand', label: t('hand') },
          { value: 'electric', label: t('electric') },
        ]}
        onChange={(type) => {
          const first = GRINDERS.find((g) => g.type === type)
          if (first) update({ grinderId: first.id })
        }}
      />
      <Select
        label={t('grinderModel')}
        value={config.grinderId}
        options={filtered.map((g) => ({ value: g.id, label: `${g.brand} ${g.model}` }))}
        onChange={(grinderId) => update({ grinderId })}
      />
      <Slider
        label={t('targetMicron')}
        value={config.micron}
        min={MICRON_RANGE.min}
        max={MICRON_RANGE.max}
        step={10}
        suffix={t('micron')}
        onChange={(v) => update({ micron: v })}
      />
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="metric">
          <div className="metric-value text-lg">{L(band.name)}</div>
          <div className="metric-label">{L(band.methods)}</div>
        </div>
        <div className="metric">
          <div className="metric-value text-lg">~{setting}</div>
          <div className="metric-label">{t('suggestedSetting')}</div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-coffee-400">{L(grinder.notes)}</p>
    </Panel>
  )
}
