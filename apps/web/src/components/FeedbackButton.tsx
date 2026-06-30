import { useState } from 'react'
import { useT } from '../i18n/LanguageContext'
import { useAuth } from '../auth/AuthContext'
import { api } from '../lib/api'
import { Modal } from './Modal'

export function FeedbackButton() {
  const { t } = useT()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('suggestion')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const reset = () => {
    setOpen(false)
    setType('suggestion')
    setMessage('')
    setEmail('')
    setDone(false)
  }

  const submit = async () => {
    if (message.trim().length < 2) return
    setBusy(true)
    try {
      await api.post('/feedback', {
        message: message.trim(),
        type,
        email: (email || user?.email || '').trim() || undefined,
        page: window.location.pathname,
      })
      setDone(true)
    } catch {
      /* swallow — feedback is best-effort */
      setDone(true)
    } finally {
      setBusy(false)
    }
  }

  const types = [
    { id: 'suggestion', label: t('typeSuggestion') },
    { id: 'bug', label: t('typeBug') },
    { id: 'other', label: t('typeOther') },
  ]

  return (
    <>
      <button onClick={() => setOpen(true)} className="font-semibold text-coffee-400 transition hover:text-brand-teal">
        💬 {t('navFeedback')}
      </button>

      {open && (
        <Modal label={t('feedbackTitle')} onClose={reset}>
          <div className="panel">
            {done ? (
              <div className="py-6 text-center">
                <div className="mb-2 text-4xl">🙏</div>
                <p className="text-sm font-semibold text-crema">{t('feedbackThanks')}</p>
                <button className="btn-ghost mx-auto mt-4 px-4" onClick={reset}>
                  {t('done')}
                </button>
              </div>
            ) : (
              <>
                <h2 className="panel-title">{t('feedbackTitle')}</h2>
                <p className="mb-3 text-xs text-coffee-300">{t('feedbackIntro')}</p>

                <div className="mb-3 flex flex-wrap gap-2">
                  {types.map((ty) => (
                    <button
                      key={ty.id}
                      type="button"
                      className={`chip ${type === ty.id ? 'chip-active' : ''}`}
                      onClick={() => setType(ty.id)}
                    >
                      {ty.label}
                    </button>
                  ))}
                </div>

                <label className="mb-3 block">
                  <span className="field-label">{t('feedbackMsg')}</span>
                  <textarea
                    className="input min-h-[110px]"
                    placeholder={t('feedbackMsgPh')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={4000}
                    autoFocus
                  />
                </label>

                {!user && (
                  <label className="mb-3 block">
                    <span className="field-label">{t('feedbackEmail')}</span>
                    <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </label>
                )}

                <button className="btn-primary w-full" onClick={submit} disabled={busy || message.trim().length < 2}>
                  {t('feedbackSend')}
                </button>
              </>
            )}
          </div>
        </Modal>
      )}
    </>
  )
}
