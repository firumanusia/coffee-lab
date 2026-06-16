import { useMemo } from 'react'
import { useCatalog } from '../../catalog/CatalogContext'
import { processInfo } from '../../data/processInfo'
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
  const { beans } = useCatalog()

  const bean = beans.find((b) => b.id === config.beanId) ?? beans[0]
  const roast = roastFromAgtron(config.agtron)
  const proc = processInfo(config.processId)

  const origins = useMemo(() => uniq(beans.map((b) => b.origin)), [beans])
  const regions = useMemo(
    () => uniq(beans.filter((b) => b.origin === bean.origin).map((b) => b.region)),
    [beans, bean.origin],
  )
  const varieties = useMemo(
    () => beans.filter((b) => b.origin === bean.origin && b.region === bean.region),
    [beans, bean.origin, bean.region],
  )

  const selectBean = (b: (typeof beans)[number]) =>
    update({ beanId: b.id, processId: b.processes[0] ?? 'Washed', agtron: b.agtron })

  const onOrigin = (origin: string) => {
    const b = beans.find((x) => x.origin === origin)
    if (b) selectBean(b)
  }
  const onRegion = (region: string) => {
    const b = beans.find((x) => x.origin === bean.origin && x.region === region)
    if (b) selectBean(b)
  }
  const onVariety = (id: string) => {
    const b = beans.find((x) => x.id === id)
    if (b) selectBean(b)
  }

  // reversed so the bar reads dark (low Agtron, left) → light (high Agtron, right),
  // matching the slider direction.
  const gradientBands = [...ROAST_BANDS].reverse()

  return (
    <Panel title={t('secBeans')} icon={<Icons.beans size={16} />}>
      <Select
        label={t('origin')}
        value={bean.origin}
        options={origins.map((o) => ({ value: o, label: o }))}
        onChange={onOrigin}
      />
      <Select label={t('region')} value={bean.region} options={regions.map((r) => ({ value: r, label: r }))} onChange={onRegion} />
      <Select
        label={`${t('variety')} (${bean.species})`}
        value={bean.id}
        options={varieties.map((b) => ({ value: b.id, label: `${b.variety} · ${b.processes.join('/')}` }))}
        onChange={onVariety}
      />
      <Select
        label={t('process')}
        value={config.processId}
        options={(bean.processes.length ? bean.processes : ['Washed']).map((p) => ({ value: p, label: p }))}
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
          {t('elevation')}: <b className="text-crema">{bean.elevation} mdpl</b> · {t('roastIdeal')}: <b className="text-crema">{bean.roastIdeal}</b>
        </div>
        <p className="text-coffee-200">
          <b className="text-crema">{bean.aroma}</b> — {bean.notes}
        </p>
        <p className="mt-1 text-coffee-400">{L(proc.flavor)}</p>
      </div>
    </Panel>
  )
}
