import { DRIPPERS } from '../../data/drippers'
import { FILTERS } from '../../data/filters'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select } from '../ui'

const FLOW_LABEL = (f: number, lang: 'id' | 'en') =>
  f >= 1.1 ? (lang === 'id' ? 'Cepat' : 'Fast') : f <= 0.85 ? (lang === 'id' ? 'Lambat' : 'Slow') : lang === 'id' ? 'Sedang' : 'Medium'

export function GearPanel({ store }: { store: BrewStore }) {
  const { t, lang } = useT()
  const L = useLocalized()
  const { config, update } = store

  const dripper = DRIPPERS.find((d) => d.id === config.dripperId) ?? DRIPPERS[0]
  const filter = FILTERS.find((f) => f.id === config.filterId) ?? FILTERS[0]

  const geoLabel = (g: string) => (g === 'conical' ? t('conical') : g === 'flat' ? t('flat') : t('hybrid'))

  return (
    <Panel title={`${t('secDripper')} · ${t('secFilter')}`} icon="🛠️">
      <Select
        label={t('secDripper')}
        value={config.dripperId}
        options={DRIPPERS.map((d) => ({ value: d.id, label: `${d.brand} ${d.name} (${geoLabel(d.geometry)})` }))}
        onChange={(dripperId) => update({ dripperId })}
      />
      <div className="mb-3 rounded-lg border border-coffee-800/60 bg-coffee-900/30 p-2 text-xs text-coffee-200">
        <span className="font-semibold text-crema">{t('flowSpeed')}: {FLOW_LABEL(dripper.flowFactor, lang)}</span>
        <p className="mt-0.5">{L(dripper.characteristics)}</p>
      </div>

      <Select
        label={t('secFilter')}
        value={config.filterId}
        options={FILTERS.map((f) => ({ value: f.id, label: `${f.brand} ${f.name}` }))}
        onChange={(filterId) => update({ filterId })}
      />
      <div className="rounded-lg border border-coffee-800/60 bg-coffee-900/30 p-2 text-xs text-coffee-200">
        <span className="font-semibold text-crema">
          {t('thickness')}: {L(filter.thickness)} · {t('flowSpeed')}: {FLOW_LABEL(filter.flowFactor, lang)}
        </span>
        <p className="mt-0.5">{L(filter.characteristics)}</p>
      </div>
    </Panel>
  )
}
