import { useState } from 'react'
import { useCatalog, useGear } from '../catalog/CatalogContext'
import { predict } from '../model/predict'
import { extractionOf, strengthOf } from '../model/sca'
import { roastFromAgtron } from '../data/roast'
import { suggestSetting } from '../data/grindLogic'
import { useLocalized, useT } from '../i18n/LanguageContext'
import type { BrewStore } from '../store/useBrewStore'
import { drawShareCard, type ShareData } from '../lib/shareCard'
import { Modal } from './Modal'

export function ShareButton({ store, variant = 'block' }: { store: BrewStore; variant?: 'block' | 'icon' }) {
  const { t } = useT()
  const L = useLocalized()
  const { config } = store
  const { beans, grinders, drippers, filters, recipes } = useCatalog()
  const gear = useGear(config)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [img, setImg] = useState<{ url: string; blob: Blob } | null>(null)

  const build = (): ShareData => {
    const p = predict(config, gear)
    const bean = beans.find((b) => b.id === config.beanId)
    const grinder = grinders.find((g) => g.id === config.grinderId)
    const dripper = drippers.find((d) => d.id === config.dripperId)
    const filter = filters.find((f) => f.id === config.filterId)
    const recipe = recipes.find((r) => r.id === config.recipeId)
    const roast = roastFromAgtron(config.agtron)
    const clicks = grinder ? suggestSetting(grinder, config.micron) : null
    const totalWater = config.dose * config.ratio
    return {
      variety: bean?.variety ?? 'Custom',
      origin: bean?.origin ?? '',
      region: bean?.region ?? '',
      process: config.processId,
      roastName: L(roast.name),
      agtron: config.agtron,
      grinder: grinder ? `${grinder.brand} ${grinder.model}` : '—',
      micron: config.micron,
      clicks: clicks === null ? '' : `~${clicks} clicks`,
      dripper: dripper ? `${dripper.brand} ${dripper.model}` : '—',
      filter: filter ? `${filter.brand} ${filter.model}` : '—',
      recipeName: recipe?.name ?? 'Custom',
      author: recipe?.author ?? '',
      dose: config.dose,
      ratio: config.ratio,
      totalWater,
      tempC: config.tempC,
      pours: config.pours.map((pp) => ({ at: pp.at, grams: pp.frac * totalWater })),
      yieldG: p.beverageMass,
      tds: p.tds,
      ey: p.ey,
      measured: p.source === 'measured',
      strength: strengthOf(p.tds),
      extraction: extractionOf(p.ey),
    }
  }

  const openModal = async () => {
    setBusy(true)
    setOpen(true)
    try {
      const res = await drawShareCard(build())
      setImg(res)
    } finally {
      setBusy(false)
    }
  }

  const close = () => {
    setOpen(false)
    setImg(null)
  }

  const download = () => {
    if (!img) return
    const a = document.createElement('a')
    a.href = img.url
    a.download = 'menoowel-brew.png'
    a.click()
  }

  const share = async () => {
    if (!img) return
    const file = new File([img.blob], 'menoowel-brew.png', { type: 'image/png' })
    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }
    if (nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: 'My MENOOWEL brew', text: 'My pour-over recipe — dial in yours at menoowel.com' })
      } catch {
        /* user cancelled */
      }
    } else {
      download()
    }
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            openModal()
          }}
          title={t('shareRecipe')}
          aria-label={t('shareRecipe')}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-brand-teal/50 text-base text-brand-teal transition hover:bg-brand-teal/15"
        >
          📸
        </button>
      ) : (
        <button
          onClick={openModal}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-deep px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-red/25 transition hover:brightness-110"
        >
          📸 {t('shareRecipe')}
        </button>
      )}

      {open && (
        <Modal label={t('shareCardTitle')} onClose={close}>
          <div className="panel text-center">
            <h2 className="panel-title justify-center">{t('shareCardTitle')}</h2>
            <div className="mb-3 overflow-hidden rounded-xl border border-coffee-800">
              {busy || !img ? (
                <div className="flex h-72 animate-pulse items-center justify-center bg-coffee-900/50 text-sm text-coffee-400">
                  {t('generating')}
                </div>
              ) : (
                <img src={img.url} alt="MENOOWEL brew recipe card" className="block w-full" />
              )}
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost flex-1 justify-center" onClick={download} disabled={!img}>
                ⬇ {t('download')}
              </button>
              {canShare && (
                <button className="btn-primary flex-1 justify-center" onClick={share} disabled={!img}>
                  ↗ {t('shareImg')}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
