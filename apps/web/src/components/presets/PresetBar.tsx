import { useState } from 'react'
import { RECIPES } from '../../data/recipes'
import { useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import { Panel } from '../ui'
import { Icons } from '../icons'

export function PresetBar({ store }: { store: BrewStore }) {
  const { t } = useT()
  const { presets, savePreset, loadPreset, deletePreset, applyRecipe } = store
  const [name, setName] = useState('')

  const save = () => {
    const n = name.trim()
    if (!n) return
    savePreset(n)
    setName('')
  }

  return (
    <Panel title={t('secPresets')} icon={<Icons.presets size={16} />}>
      <div className="mb-3 flex gap-2">
        <input
          className="input"
          placeholder={t('presetName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
        />
        <button className="btn-primary whitespace-nowrap" onClick={save} disabled={!name.trim()}>
          {t('save')}
        </button>
      </div>

      <div className="field-label">{t('championPresets')}</div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {RECIPES.filter((r) => r.fixed).map((r) => (
          <button key={r.id} className="chip" onClick={() => applyRecipe(r.id)} title={r.author}>
            {r.name} · {r.author}
          </button>
        ))}
      </div>

      <div className="field-label">{t('myPresets')}</div>
      {presets.length === 0 ? (
        <p className="text-xs text-coffee-400">{t('noPresets')}</p>
      ) : (
        <ul className="space-y-1">
          {presets.map((p) => (
            <li key={p.id} className="flex items-center justify-between rounded-lg border border-coffee-800/60 bg-coffee-900/30 px-3 py-1.5 text-xs">
              <span className="truncate font-semibold text-crema">{p.name}</span>
              <span className="flex gap-1">
                <button className="btn-ghost px-2 py-0.5 text-[11px]" onClick={() => loadPreset(p)}>
                  {t('load')}
                </button>
                <button className="px-1 text-coffee-400 hover:text-red-300" onClick={() => deletePreset(p.id)} aria-label={t('delete')}>
                  🗑
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}
