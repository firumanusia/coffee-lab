import { useT } from '../i18n/LanguageContext'
import { FeedbackButton } from './FeedbackButton'

export function Footer() {
  const { t } = useT()
  return (
    <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 text-center text-[11px] text-coffee-500">
      <span>
        <b className="text-brand-red">MENOOWEL</b> <span className="text-brand-teal">BrewLab Studio</span>
      </span>
      <span className="text-coffee-700">·</span>
      <span>
        {t('craftedBy')} <b className="text-coffee-300">firumanusia</b> &amp; <b className="text-coffee-300">andrisoo</b>
      </span>
      <span className="text-coffee-700">·</span>
      <FeedbackButton />
      <span className="text-coffee-700">·</span>
      <a href="/donate" className="font-semibold text-brand-red transition hover:text-brand-deep">
        ☕ {t('supportKofi')}
      </a>
    </footer>
  )
}
