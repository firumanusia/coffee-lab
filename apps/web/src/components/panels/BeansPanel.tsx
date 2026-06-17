import { useMemo } from 'react'
import { useCatalog } from '../../catalog/CatalogContext'
import { ROAST_BANDS, roastFromAgtron } from '../../data/roast'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select, Slider } from '../ui'
import { Icons } from '../icons'

const uniq = (arr: string[]) => Array.from(new Set(arr))

export function BeansPanel({ store }: { store: BrewStore }) {
  const { t, lang } = useT()
  const L = useLocalized()
  const { config, update } = store
  const { beans, processes } = useCatalog()

  const bean = beans.find((b) => b.id === config.beanId) ?? beans[0]
  const roast = roastFromAgtron(config.agtron)
  const proc = processes.find((p) => p.name === config.processId)

  // Cascading selection: variety → country (origin) → region.
  const varieties = useMemo(() => uniq(beans.map((b) => b.variety)).sort((a, b) => a.localeCompare(b)), [beans])
  const origins = useMemo(() => uniq(beans.filter((b) => b.variety === bean.variety).map((b) => b.origin)), [beans, bean.variety])
  const regions = useMemo(
    () => beans.filter((b) => b.variety === bean.variety && b.origin === bean.origin),
    [beans, bean.variety, bean.origin],
  )

  const onVariety = (variety: string) => {
    const b = beans.find((x) => x.variety === variety)
    if (b) update({ beanId: b.id })
  }
  const onOrigin = (origin: string) => {
    const b = beans.find((x) => x.variety === bean.variety && x.origin === origin)
    if (b) update({ beanId: b.id })
  }
  const onRegion = (id: string) => update({ beanId: id })

  const gradientBands = [...ROAST_BANDS].reverse()

  return (
    <Panel title={t('secBeans')} icon={<Icons.beans size={16} />}>
      <Select
        label={`${t('variety')} (${bean.species})`}
        value={bean.variety}
        options={varieties.map((v) => ({ value: v, label: v }))}
        onChange={onVariety}
      />
      <Select label={t('origin')} value={bean.origin} options={origins.map((o) => ({ value: o, label: o }))} onChange={onOrigin} />
      <Select
        label={t('region')}
        value={bean.id}
        options={regions.map((b) => ({ value: b.id, label: b.region }))}
        onChange={onRegion}
      />
      <Select
        label={t('process')}
        value={config.processId}
        options={processes.map((p) => ({ value: p.name, label: p.name }))}
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
      <div className="mb-1 flex h-3 overflow-hidden rounded-full">
        {gradientBands.map((b) => (
          <div key={b.id} className="flex-1" style={{ background: b.color }} title={L(b.name)} />
        ))}
      </div>
      <div className="mb-3 flex justify-between text-[10px] text-coffee-400">
        <span>{lang === 'id' ? 'Gelap · Agtron 25' : 'Dark · Agtron 25'}</span>
        <span>{lang === 'id' ? 'Agtron 100 · Terang' : 'Agtron 100 · Light'}</span>
      </div>

      <div className="rounded-xl border border-coffee-800/60 bg-coffee-900/30 p-3 text-xs">
        <div className="mb-1 flex flex-wrap gap-x-3 gap-y-0.5 text-coffee-300">
          <span>Body: <b className="text-crema">{bean.body}</b></span>
          <span>Acidity: <b className="text-crema">{bean.acidity}</b></span>
          <span>Sweetness: <b className="text-crema">{bean.sweetness}</b></span>
        </div>
        <div className="mb-1 text-coffee-300">
          {t('category')}: <b className="text-crema">{bean.category || '—'}</b> · {t('cupPotential')}: <b className="text-crema">{bean.cupPotential || '—'}</b>
        </div>
        {bean.notes && <p className="text-coffee-200">{bean.notes}</p>}
        {proc && <p className="mt-1 text-coffee-400">{proc.flavor}</p>}
      </div>
    </Panel>
  )
}
