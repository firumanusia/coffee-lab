import { useCatalog } from '../../catalog/CatalogContext'
import { useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select } from '../ui'
import { Icons } from '../icons'

export function GearPanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const { config, update } = store
  const { drippers, filters } = useCatalog()

  const dripper = drippers.find((d) => d.id === config.dripperId) ?? drippers[0]
  const filter = filters.find((f) => f.id === config.filterId) ?? filters[0]

  return (
    <Panel title={`${t('secDripper')} · ${t('secFilter')}`} icon={<Icons.gear size={16} />}>
      <Select
        label={t('secDripper')}
        value={config.dripperId}
        options={drippers.map((d) => ({ value: d.id, label: `${d.brand} ${d.model}` }))}
        onChange={(dripperId) => update({ dripperId })}
      />
      <div className="mb-3 rounded-lg border border-coffee-800/60 bg-coffee-900/30 p-2 text-xs text-coffee-200">
        <span className="font-semibold capitalize text-crema">{dripper.geometry}</span> · {dripper.typeRaw}
        {dripper.immersion && (
          <span className="ml-1 rounded-full bg-brand-teal/20 px-2 py-0.5 text-[10px] font-semibold text-brand-tealLight">
            {t('immersion')}
          </span>
        )}
      </div>

      <Select
        label={t('secFilter')}
        value={config.filterId}
        options={filters.map((f) => ({ value: f.id, label: `${f.brand} ${f.model}` }))}
        onChange={(filterId) => update({ filterId })}
      />
      <div className="rounded-lg border border-coffee-800/60 bg-coffee-900/30 p-2 text-xs text-coffee-200">
        <span className="font-semibold text-crema">{filter.material}</span> · {t('flowSpeed')}: {filter.flowRate}
        <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-coffee-300">
          <span>Body: {filter.body}</span>
          <span>Clarity: {filter.clarity}</span>
          <span>Sweetness: {filter.sweetness}</span>
          <span>Acidity: {filter.acidity}</span>
        </div>
      </div>
    </Panel>
  )
}
