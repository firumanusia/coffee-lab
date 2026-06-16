import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useT } from '../i18n/LanguageContext'
import { Modal } from '../components/Modal'
import { Icons } from '../components/icons'

export function AuthControls() {
  const { t } = useT()
  const { user, login, register, logout, loginWithGoogle } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
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

  const submit = async () => {
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') await login(email, password)
      else await register(email, password, name || undefined)
      setOpen(false)
      setEmail('')
      setPassword('')
      setName('')
    } catch {
      setError(t('authFailed'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => setOpen(true)}>
        {t('signIn')}
      </button>
      {open && (
        <Modal label={t('signIn')} onClose={() => setOpen(false)}>
          <div className="panel">
            <h2 className="panel-title">{mode === 'login' ? t('signIn') : t('signUp')}</h2>
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
            {error && <p className="mb-2 text-xs text-brand-red">{error}</p>}
            <button className="btn-primary w-full" onClick={submit} disabled={busy || !email || !password}>
              {mode === 'login' ? t('signIn') : t('signUp')}
            </button>
            <button
              className="mt-3 w-full text-center text-xs text-coffee-300 hover:text-crema"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login')
                setError('')
              }}
            >
              {mode === 'login' ? t('needAccount') : t('haveAccount')}
            </button>
            <p className="mt-3 text-center text-[10px] text-coffee-400">{t('syncNote')}</p>
          </div>
        </Modal>
      )}
    </>
  )
}
