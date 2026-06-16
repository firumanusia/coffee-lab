import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** Lightweight modal: backdrop click + ESC to close. Child supplies its own card chrome. */
export function Modal({ onClose, children, label }: { onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="relative my-auto w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -right-2 -top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-coffee-700 bg-coffee-900 text-coffee-100 transition hover:border-brand-red hover:text-brand-red"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
