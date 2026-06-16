import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useT } from '../i18n/LanguageContext'
import { Modal } from '../components/Modal'
import { Icons } from '../components/icons'

type Mode = 'login' | 'register' | 'verify'

export function AuthControls() {
  const { t } = useT()
  const { user, login, register, verifyEmail, resendCode, logout, loginWithGoogle } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden max-w-[12ch] truncate text-xs text-coffee-300 sm:inline" title={user.email}>
          {user.name || user.email}
        </span>
        <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => logout()}>
          {t('signOut')}
        </button>
      </div>
    )
  }

  const reset = () => {
    setError('')
    setInfo('')
  }

  const submit = async () => {
    setBusy(true)
    reset()
    try {
      if (mode === 'login') {
        await login(email, password)
        close()
      } else if (mode === 'register') {
        const r = await register(email, password, name || undefined)
        if (r?.needsVerification) {
          setMode('verify')
          setInfo(t('codeSent'))
        }
      } else {
        await verifyEmail(email, code)
        close()
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      if (msg.includes('EMAIL_NOT_VERIFIED')) {
        setMode('verify')
        setInfo(t('codeSent'))
      } else if (mode === 'verify') {
        setError(t('codeInvalid'))
      } else {
        setError(t('authFailed'))
      }
    } finally {
      setBusy(false)
    }
  }

  const close = () => {
    setOpen(false)
    setMode('login')
    setEmail('')
    setPassword('')
    setName('')
    setCode('')
    reset()
  }

  const resend = async () => {
    reset()
    await resendCode(email).catch(() => {})
    setInfo(t('codeSent'))
  }

  return (
    <>
      <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => setOpen(true)}>
        {t('signIn')}
      </button>
      {open && (
        <Modal label={t('signIn')} onClose={close}>
          <div className="panel">
            <h2 className="panel-title">
              {mode === 'login' ? t('signIn') : mode === 'register' ? t('signUp') : t('verifyEmail')}
            </h2>

            {mode !== 'verify' && (
              <>
                <button className="btn-ghost mb-3 w-full" onClick={loginWithGoogle}>
                  <Icons.flask size={15} /> {t('googleContinue')}
                </button>
                <div className="mb-3 text-center text-[11px] text-coffee-400">— or —</div>
                {mode === 'register' && (
                  <label className="mb-2 block">
                    <span className="field-label">{t('nameLabel')}</span>
                    <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                  </label>
                )}
                <label className="mb-2 block">
                  <span className="field-label">{t('emailLabel')}</span>
                  <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label className="mb-3 block">
                  <span className="field-label">{t('passwordLabel')}</span>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                  />
                </label>
              </>
            )}

            {mode === 'verify' && (
              <>
                <p className="mb-3 text-xs text-coffee-300">
                  {t('verifyHint')} <b className="text-crema">{email}</b>
                </p>
                <label className="mb-3 block">
                  <span className="field-label">{t('codeLabel')}</span>
                  <input
                    className="input text-center text-lg tracking-[0.4em]"
                    inputMode="numeric"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    autoFocus
                  />
                </label>
              </>
            )}

            {error && <p className="mb-2 text-xs text-brand-red">{error}</p>}
            {info && <p className="mb-2 text-xs text-brand-tealLight">{info}</p>}

            <button
              className="btn-primary w-full"
              onClick={submit}
              disabled={busy || (mode === 'verify' ? code.length < 6 : !email || !password)}
            >
              {mode === 'login' ? t('signIn') : mode === 'register' ? t('signUp') : t('verifyEmail')}
            </button>

            {mode === 'verify' ? (
              <button className="mt-3 w-full text-center text-xs text-coffee-300 hover:text-crema" onClick={resend}>
                {t('resendCode')}
              </button>
            ) : (
              <button
                className="mt-3 w-full text-center text-xs text-coffee-300 hover:text-crema"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  reset()
                }}
              >
                {mode === 'login' ? t('needAccount') : t('haveAccount')}
              </button>
            )}
            {mode !== 'verify' && <p className="mt-3 text-center text-[10px] text-coffee-400">{t('syncNote')}</p>}
          </div>
        </Modal>
      )}
    </>
  )
}
