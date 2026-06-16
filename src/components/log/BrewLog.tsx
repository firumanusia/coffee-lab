import { useState } from 'react'
import { ORIGINS } from '../../data/origins'
import { RECIPES } from '../../data/recipes'
import { predict } from '../../model/predict'
import { extractionOf, strengthOf } from '../../model/sca'
import { useT } from '../../i18n/LanguageContext'
import type { BrewStore } from '../../store/useBrewStore'
import type { BrewFeedback } from '../../store/types'
import { Panel } from '../ui'
import { Icons } from '../icons'

const EMPTY: BrewFeedback = { rating: 4, notes: '', body: 3, acidity: 3, sweetness: 3, improvement: '' }

export function BrewLog({ store }: { store: BrewStore }) {
  const { t, lang } = useT()
  const { config, addLog, log, deleteLog, setConfig } = store
  const [open, setOpen] = useState(false)
  const [fb, setFb] = useState<BrewFeedback>(EMPTY)
  const [name, setName] = useState('')

  const p = predict(config)
  const autoSuggest = buildSuggestions(p.ey, p.tds, lang)

  const submit = () => {
    addLog({
      name: name.trim() || defaultName(config.recipeId),
      result: { yield: Math.round(p.beverageMass), tds: p.tds, ey: p.ey },
      feedback: { ...fb, improvement: fb.improvement || autoSuggest },
    })
    setFb(EMPTY)
    setName('')
    setOpen(false)
  }

  return (
    <Panel
      title={t('secLog')}
      icon={<Icons.log size={16} />}
      aside={
        <button className="btn-primary px-3 py-1 text-xs" onClick={() => setOpen((o) => !o)}>
          {t('logBrew')}
        </button>
      }
    >
      {open && (
        <div className="mb-4 rounded-xl border border-coffee-700 bg-coffee-900/40 p-3">
          <input className="input mb-3" placeholder={defaultName(config.recipeId)} value={name} onChange={(e) => setName(e.target.value)} />

          <Stars label={t('rating')} value={fb.rating} onChange={(rating) => setFb({ ...fb, rating })} />
          <label className="mb-3 block">
            <span className="field-label">{t('tastingNotes')}</span>
            <input className="input" placeholder={t('tastingNotesPh')} value={fb.notes} onChange={(e) => setFb({ ...fb, notes: e.target.value })} />
          </label>

          <div className="mb-3 grid grid-cols-3 gap-3">
            <Mini label={t('body')} value={fb.body} onChange={(body) => setFb({ ...fb, body })} />
            <Mini label={t('acidity')} value={fb.acidity} onChange={(acidity) => setFb({ ...fb, acidity })} />
            <Mini label={t('sweetness')} value={fb.sweetness} onChange={(sweetness) => setFb({ ...fb, sweetness })} />
          </div>

          <div className="mb-2 rounded-lg bg-coffee-950/50 px-3 py-2 text-xs text-coffee-200">
            <b className="text-crema">{t('suggestions')}:</b> {autoSuggest}
          </div>
          <label className="mb-3 block">
            <span className="field-label">{t('notes')}</span>
            <textarea className="input min-h-[60px]" placeholder={t('notesPh')} value={fb.improvement} onChange={(e) => setFb({ ...fb, improvement: e.target.value })} />
          </label>

          <div className="flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setOpen(false)}>
              {t('cancel')}
            </button>
            <button className="btn-primary" onClick={submit}>
              {t('saveLog')}
            </button>
          </div>
        </div>
      )}

      {log.length === 0 ? (
        <p className="text-xs text-coffee-400">{t('noLogs')}</p>
      ) : (
        <ul className="space-y-2">
          {log.map((e) => (
            <li key={e.id} className="rounded-xl border border-coffee-800/60 bg-coffee-900/30 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-crema">
                    {'★'.repeat(e.feedback.rating)}
                    <span className="text-coffee-700">{'★'.repeat(5 - e.feedback.rating)}</span> {e.name}
                  </div>
                  <div className="text-[11px] text-coffee-400">{fmtDate(e.createdAt)}</div>
                </div>
                <span className="flex gap-1">
                  <button className="btn-ghost px-2 py-0.5 text-[11px]" onClick={() => setConfig({ ...e.config })}>
                    {t('loadConfig')}
                  </button>
                  <button className="px-1 text-coffee-400 hover:text-red-300" onClick={() => deleteLog(e.id)} aria-label={t('delete')}>
                    🗑
                  </button>
                </span>
              </div>
              <div className="mt-1 text-xs text-coffee-200">
                {originName(e.config.originId)} · {e.config.dose}g 1:{e.config.ratio} · {e.config.tempC}°C · {Math.round(e.config.micron)}µm
              </div>
              <div className="mt-1 flex flex-wrap gap-x-3 text-[11px] text-coffee-300">
                <span>TDS {e.result.tds}%</span>
                <span>EY {e.result.ey}%</span>
                <span>{strengthOf(e.result.tds)}/{extractionOf(e.result.ey)}</span>
              </div>
              {e.feedback.notes && <p className="mt-1 text-xs italic text-crema">“{e.feedback.notes}”</p>}
              {e.feedback.improvement && <p className="mt-1 text-xs text-coffee-300">→ {e.feedback.improvement}</p>}
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

function Stars({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-3">
      <span className="field-label">{label}</span>
      <div className="flex gap-1 text-2xl">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)} className={n <= value ? 'text-crema' : 'text-coffee-700'}>
            ★
          </button>
        ))}
      </div>
    </div>
  )
}

function Mini({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block text-center">
      <span className="field-label">{label}</span>
      <input type="range" min={1} max={5} value={value} className="w-full" onChange={(e) => onChange(Number(e.target.value))} />
      <span className="text-xs text-coffee-300">{value}/5</span>
    </label>
  )
}

function buildSuggestions(ey: number, tds: number, lang: 'id' | 'en'): string {
  const parts: string[] = []
  if (ey < 18) parts.push(lang === 'id' ? 'giling lebih halus / suhu naik' : 'grind finer / raise temp')
  else if (ey > 22) parts.push(lang === 'id' ? 'giling lebih kasar / suhu turun' : 'grind coarser / lower temp')
  if (tds < 1.15) parts.push(lang === 'id' ? 'naikkan rasio kopi' : 'increase coffee ratio')
  else if (tds > 1.35) parts.push(lang === 'id' ? 'tambah air (rasio turun)' : 'add water (lower ratio)')
  if (parts.length === 0) return lang === 'id' ? 'Pertahankan — sudah seimbang.' : 'Keep it — well balanced.'
  return parts.join(', ')
}

const originName = (id: string) => ORIGINS.find((o) => o.id === id)?.name ?? id
const defaultName = (recipeId: string) => RECIPES.find((r) => r.id === recipeId)?.name ?? 'Brew'

function fmtDate(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleString()
}
