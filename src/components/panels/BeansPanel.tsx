import { ORIGINS } from '../../data/origins'
import { PROCESSES } from '../../data/processes'
import { ROAST_BANDS, roastFromAgtron } from '../../data/roast'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select, Slider } from '../ui'

export function BeansPanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update } = store

  const origin = ORIGINS.find((o) => o.id === config.originId) ?? ORIGINS[0]
  const process = PROCESSES.find((p) => p.id === config.processId) ?? PROCESSES[0]
  const roast = roastFromAgtron(config.agtron)

  return (
    <Panel title={t('secBeans')} icon="🌱">
      <Select
        label={t('origin')}
        value={config.originId}
        options={ORIGINS.map((o) => ({ value: o.id, label: o.name }))}
        onChange={(originId) => {
          const o = ORIGINS.find((x) => x.id === originId)!
          update({ originId, variety: o.varieties[0] })
        }}
      />
      <Select
        label={t('variety')}
        value={config.variety}
        options={origin.varieties.map((v) => ({ value: v, label: v }))}
        onChange={(variety) => update({ variety })}
      />
      <Select
        label={t('process')}
        value={config.processId}
        options={PROCESSES.map((p) => ({ value: p.id, label: L(p.name) }))}
        onChange={(processId) => update({ processId })}
      />

      <Slider
        label={`${t('roastLevel')} — ${L(roast.name)}`}
        value={config.agtron}
        min={25}
        max={100}
        suffix="Agtron"
        onChange={(v) => update({ agtron: v })}
      />
      <div className="mb-3 flex h-3 overflow-hidden rounded-full">
        {ROAST_BANDS.map((b) => (
          <div key={b.id} className="flex-1" style={{ background: b.color }} title={L(b.name)} />
        ))}
      </div>

      <div className="rounded-xl border border-coffee-800/60 bg-coffee-900/30 p-3 text-xs">
        <div className="field-label">{t('flavorTendency')}</div>
        <p className="text-coffee-200">
          <b className="text-crema">{origin.name}:</b> {L(origin.flavor)}
        </p>
        <p className="mt-1 text-coffee-200">
          <b className="text-crema">{L(process.name)}:</b> {L(process.flavor)}
        </p>
      </div>
    </Panel>
  )
}
