import { TEMP_RANGE, WATER_SCA, suggestTemp } from '../../data/water'
import { roastFromAgtron } from '../../data/roast'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Slider } from '../ui'
import { Icons } from '../icons'

export function WaterPanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update } = store
  const suggested = suggestTemp(config.agtron)
  const roast = roastFromAgtron(config.agtron)

  return (
    <Panel title={t('secWater')} icon={<Icons.water size={16} />}>
      <Slider
        label={t('waterTemp')}
        value={config.tempC}
        min={TEMP_RANGE.min}
        max={TEMP_RANGE.max}
        suffix="°C"
        onChange={(v) => update({ tempC: v })}
      />
      <button className="btn-ghost mb-3 w-full text-xs" onClick={() => update({ tempC: suggested })}>
        {t('suggestedSetting')}: {suggested}°C · {L(roast.name)}
      </button>
      <p className="mb-3 text-xs text-coffee-300">{config.agtron >= 70 ? t('tempHintLight') : t('tempHintDark')}</p>

      <div className="rounded-xl border border-coffee-800/60 bg-coffee-900/30 p-3">
        <div className="field-label">{t('mineralProfile')}</div>
        <Mineral name={t('totalHardness')} v={WATER_SCA.totalHardness} />
        <Mineral name={t('alkalinity')} v={WATER_SCA.alkalinity} />
        <Mineral name={t('tdsWater')} v={WATER_SCA.tds} />
      </div>
    </Panel>
  )
}

function Mineral({ name, v }: { name: string; v: { min: number; target: number; max: number; unit: string } }) {
  const pct = ((v.target - v.min) / (v.max - v.min)) * 100
  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between text-xs">
        <span className="text-coffee-200">{name}</span>
        <span className="font-semibold text-crema">
          {v.target} {v.unit}
        </span>
      </div>
      <div className="relative mt-1 h-1.5 rounded-full bg-coffee-950">
        <div className="absolute inset-y-0 rounded-full bg-coffee-600" style={{ left: '8%', right: '8%' }} />
        <div className="absolute top-1/2 h-3 w-1 -translate-y-1/2 rounded bg-crema" style={{ left: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] text-coffee-400">
        <span>{v.min}</span>
        <span>{v.max}</span>
      </div>
    </div>
  )
}
