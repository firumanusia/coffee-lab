import { POUR_STYLES, type PourStep, type PourStyle } from '../../data/recipes'
import { useCatalog } from '../../catalog/CatalogContext'
import { useLocalized, useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel, Select, Slider } from '../ui'
import { Icons } from '../icons'

export function RecipePanel({ store }: { store: BrewStore }) {
  const { t } = useT()
  const L = useLocalized()
  const { config, update, applyRecipe } = store
  const { recipes, drippers } = useCatalog()

  const recipe = recipes.find((r) => r.id === config.recipeId)
  const dripper = drippers.find((d) => d.id === config.dripperId)
  const isImmersion = !!dripper?.immersion
  const totalWater = config.dose * config.ratio
  const pourSum = config.pours.reduce((s, p) => s + p.frac, 0)

  const setPours = (pours: PourStep[]) => update({ pours })

  const editPour = (i: number, patch: Partial<PourStep>) => {
    const next = config.pours.map((p, idx) => (idx === i ? { ...p, ...patch } : p))
    setPours(next)
  }
  const addPour = () => {
    const last = config.pours[config.pours.length - 1]
    setPours([...config.pours, { at: (last?.at ?? 0) + 30, frac: 0.15, style: 'spiral' }])
  }
  const removePour = (i: number) => setPours(config.pours.filter((_, idx) => idx !== i))
  const normalize = () => {
    const n = config.pours.length
    setPours(config.pours.map((p) => ({ ...p, frac: 1 / n })))
  }

  let cumulative = 0

  return (
    <Panel title={t('secRecipe')} icon={<Icons.recipe size={16} />}>
      <Select
        label="Recipe"
        value={config.recipeId}
        options={recipes.map((r) => ({ value: r.id, label: `${r.name} — ${r.author}` }))}
        onChange={(id) => {
          const r = recipes.find((x) => x.id === id)
          if (r) applyRecipe(r)
        }}
      />
      {recipe && <p className="-mt-1 mb-3 text-[11px] text-coffee-300">{L(recipe.description)}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Slider label={t('dose')} value={config.dose} min={8} max={60} step={0.5} suffix="g" onChange={(v) => update({ dose: v })} />
        <Slider label={t('ratio')} value={config.ratio} min={12} max={20} step={0.1} suffix={`(1:${config.ratio})`} onChange={(v) => update({ ratio: Number(v.toFixed(1)) })} />
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-coffee-900/40 px-3 py-2">
        <span className="text-xs text-coffee-300">{t('totalWater')}</span>
        <span className="text-lg font-bold text-crema">{Math.round(totalWater)} g</span>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="field-label mb-0">{t('pours')}</span>
        <span className={`text-[11px] ${config.fixedPours ? 'text-coffee-400' : 'text-coffee-300'}`}>
          {config.fixedPours ? t('fixedRecipe') : t('editableRecipe')}
        </span>
      </div>

      {!config.fixedPours && (
        <div className="mb-1 grid grid-cols-[auto_1fr_1fr_auto] gap-2 px-2 text-[10px] uppercase tracking-wide text-coffee-400">
          <span className="w-5 text-center">#</span>
          <span>{t('pourTime')}</span>
          <span>{t('pourWater')}</span>
          <span className="pr-6 text-right">{t('pourStyle')}</span>
        </div>
      )}

      <div className="space-y-1.5">
        {config.pours.map((p, i) => {
          const g = p.frac * totalWater
          cumulative += g
          return (
            <div key={i} className="grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-lg border border-coffee-800/60 bg-coffee-900/30 px-2 py-1.5 text-xs">
              <span className="w-5 text-center font-bold text-coffee-400">{i + 1}</span>
              {config.fixedPours ? (
                <>
                  <span className="text-coffee-200">
                    {fmtTime(p.at)} · <b className="text-crema">{Math.round(g)}g</b>
                  </span>
                  <span className="text-coffee-300">{L(POUR_STYLES.find((s) => s.id === p.style)!.label)}</span>
                  <span className="text-right text-coffee-400">{Math.round(cumulative)}g</span>
                </>
              ) : (
                <>
                  <input
                    type="number"
                    className="input px-2 py-1"
                    value={p.at}
                    min={0}
                    step={5}
                    onChange={(e) => editPour(i, { at: Number(e.target.value) })}
                    aria-label="time"
                  />
                  <input
                    type="number"
                    className="input px-2 py-1"
                    value={Math.round(g)}
                    min={0}
                    step={5}
                    onChange={(e) => editPour(i, { frac: totalWater ? Number(e.target.value) / totalWater : 0 })}
                    aria-label="grams"
                  />
                  <div className="flex items-center gap-1">
                    <select
                      className="input px-1 py-1"
                      value={p.style}
                      onChange={(e) => editPour(i, { style: e.target.value as PourStyle })}
                    >
                      {POUR_STYLES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {L(s.label)}
                        </option>
                      ))}
                    </select>
                    <button className="px-1 text-coffee-400 hover:text-red-300" onClick={() => removePour(i)} aria-label="remove">
                      ✕
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {!config.fixedPours && (
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="btn-ghost px-2 py-1 text-xs" onClick={addPour}>
              {t('addPour')}
            </button>
            <button className="btn-ghost px-2 py-1 text-xs" onClick={normalize}>
              {t('resetPours')}
            </button>
          </div>
          <span className={`text-[11px] ${Math.abs(pourSum - 1) > 0.02 ? 'text-amber-400' : 'text-coffee-400'}`}>
            Σ {Math.round(pourSum * 100)}%
          </span>
        </div>
      )}

      {isImmersion && (
        <div className="mt-3 rounded-lg border border-brand-teal/40 bg-brand-teal/10 p-2">
          <div className="mb-1 flex items-center gap-2 text-[11px] font-semibold text-brand-tealLight">
            {t('switchTiming')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="field-label">{t('switchClose')} (s)</span>
              <input
                type="number"
                className="input px-2 py-1"
                min={0}
                step={5}
                placeholder="0"
                value={config.switchCloseAt ?? ''}
                onChange={(e) => update({ switchCloseAt: e.target.value ? Number(e.target.value) : undefined })}
              />
            </label>
            <label className="text-xs">
              <span className="field-label">{t('switchOpen')} (s)</span>
              <input
                type="number"
                className="input px-2 py-1"
                min={0}
                step={5}
                placeholder="60"
                value={config.switchOpenAt ?? ''}
                onChange={(e) => update({ switchOpenAt: e.target.value ? Number(e.target.value) : undefined })}
              />
            </label>
          </div>
          <p className="mt-1 text-[10px] text-coffee-400">{t('switchHint')}</p>
        </div>
      )}
    </Panel>
  )
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}
