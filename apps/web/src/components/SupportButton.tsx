import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { Modal } from './Modal'

const KOFI = 'https://ko-fi.com/firumanusia'

export function SupportButton() {
  const { t } = useT()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-brand-teal/50 px-2.5 py-1.5 text-xs font-semibold text-brand-teal transition hover:bg-brand-teal/10"
        title={t('supportTitle')}
      >
        <span aria-hidden>☕</span>
        <span className="hidden sm:inline">{t('navSupport')}</span>
      </button>

      {open && (
        <Modal label={t('supportTitle')} onClose={() => setOpen(false)}>
          <div className="panel text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-brand-red/15 text-3xl">☕</div>
            <h2 className="mb-2 text-lg font-extrabold text-crema">{t('supportTitle')}</h2>
            <p className="mx-auto mb-5 max-w-sm text-sm leading-relaxed text-coffee-300">{t('supportIntro')}</p>
            <a
              href={KOFI}
              target="_blank"
              rel="noopener"
              className="btn-primary w-full justify-center py-2.5 text-sm"
              onClick={() => setOpen(false)}
            >
              ☕ {t('supportCta')}
            </a>
            <button
              className="mt-3 w-full text-center text-xs text-coffee-400 transition hover:text-coffee-200"
              onClick={() => setOpen(false)}
            >
              {t('maybeLater')}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}
