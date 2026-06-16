import { useEffect, useRef, useState } from 'react'
import { POUR_STYLES } from '../../data/recipes'
import { predict } from '../../model/predict'
import { useGear } from '../../catalog/CatalogContext'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel } from '../ui'
import { Icons } from '../icons'

export function BrewTimer({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config } = store
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef<number | null>(null)

  const totalWater = config.dose * config.ratio
  const finish = predict(config, useGear(config)).brewTimeSec
  let cum = 0
  const steps = config.pours.map((p) => {
    cum += p.frac * totalWater
    return { ...p, grams: p.frac * totalWater, cumulative: cum }
  })

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    }
    return () => {
      if (ref.current) window.clearInterval(ref.current)
    }
  }, [running])

  const reset = () => {
    setRunning(false)
    setElapsed(0)
  }

  const activeIdx = steps.findIndex((s, i) => elapsed >= s.at && (i === steps.length - 1 || elapsed < steps[i + 1].at))
  const next = steps.find((s) => s.at > elapsed)
  const progress = Math.min(100, (elapsed / Math.max(finish, 1)) * 100)

  return (
    <Panel title={t('secTimer')} icon={<Icons.timer size={16} />}>
      <div className="mb-3 text-center">
        <div className="font-mono text-5xl font-extrabold text-crema">{fmt(elapsed)}</div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-coffee-950">
          <div className="h-full bg-brand-red transition-all" style={{ width: `${progress}%` }} />
        </div>
        {next ? (
          <p className="mt-2 text-xs text-coffee-300">
            {t('nextPour')}: <b className="text-crema">{fmt(next.at)}</b> · {Math.round(next.grams)}g ({L(POUR_STYLES.find((s) => s.id === next.style)!.label)})
          </p>
        ) : (
          <p className="mt-2 text-xs text-brand-tealLight">{elapsed >= finish ? t('done') + ' ✓' : ''}</p>
        )}
      </div>

      <div className="mb-3 flex justify-center gap-2">
        <button className="btn-primary" onClick={() => setRunning((r) => !r)}>
          {running ? t('pause') : t('start')}
        </button>
        <button className="btn-ghost" onClick={reset}>
          {t('reset')}
        </button>
      </div>

      <div className="space-y-1">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs transition ${
              i === activeIdx
                ? 'border-brand-red bg-brand-red/15 text-crema'
                : elapsed >= s.at
                  ? 'border-coffee-800/60 bg-coffee-900/20 text-coffee-400'
                  : 'border-coffee-800/60 bg-coffee-900/30 text-coffee-200'
            }`}
          >
            <span className="font-mono font-bold">{fmt(s.at)}</span>
            <span>{L(POUR_STYLES.find((p) => p.id === s.style)!.label)}</span>
            <span>
              +{Math.round(s.grams)}g → <b>{Math.round(s.cumulative)}g</b>
            </span>
          </div>
        ))}
        {config.switchCloseAt !== undefined && (
          <SwitchRow at={config.switchCloseAt} label={t('switchClose')} done={elapsed >= config.switchCloseAt} />
        )}
        {config.switchOpenAt !== undefined && (
          <SwitchRow at={config.switchOpenAt} label={t('switchOpen')} done={elapsed >= config.switchOpenAt} />
        )}
        <div className="flex items-center justify-between rounded-lg border border-brand-teal/40 bg-brand-teal/10 px-3 py-1.5 text-xs text-brand-tealLight">
          <span className="font-mono font-bold">~{fmt(finish)}</span>
          <span>{t('done')}</span>
          <span>{Math.round(totalWater)}g</span>
        </div>
      </div>
    </Panel>
  )
}

function SwitchRow({ at, label, done }: { at: number; label: string; done: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border border-dashed px-3 py-1.5 text-xs transition ${
        done ? 'border-coffee-800/60 text-coffee-400' : 'border-brand-teal/50 text-brand-tealLight'
      }`}
    >
      <span className="font-mono font-bold">{fmt(at)}</span>
      <span>🔀 {label}</span>
      <span />
    </div>
  )
}

function fmt(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}
