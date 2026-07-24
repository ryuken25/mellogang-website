import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { STATUS } from './data'

/* ---------- Status badge (sistem warna T9) ---------- */
export function Badge({ status, tone, children, className = '' }) {
  const def = status ? STATUS[status] : null
  const t = tone || def?.tone || 'outline'
  return <span className={`adm-badge ${t} ${className}`}>{children ?? def?.label ?? status}</span>
}

/* ---------- Filter pills ---------- */
export function Pills({ items, value, onChange }) {
  return (
    <div className="adm-pills">
      {items.map((it) => (
        <button
          key={it.key}
          type="button"
          className={`adm-pill ${it.tone || ''} ${value === it.key ? 'on' : ''}`}
          onClick={() => onChange(it.key)}
        >
          {it.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- Toast system ---------- */
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

const TOAST_ICONS = {
  green: (
    <svg width="18" height="18" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7.2" fill="rgba(143,191,143,.15)" stroke="#8fbf8f" />
      <path d="M5 8.2l2 2 4-4.5" fill="none" stroke="#8fbf8f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  red: (
    <svg width="18" height="18" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7.2" fill="rgba(201,124,124,.15)" stroke="#c97c7c" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#c97c7c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  gold: (
    <svg width="18" height="18" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7.2" fill="rgba(201,162,106,.15)" stroke="#c9a26a" />
      <path d="M8 4.5v4M8 11v.4" stroke="#c9a26a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const push = useCallback((tone, title, body) => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, tone, title, body }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000)
  }, [])

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="adm-toasts">
        {toasts.map((t) => (
          <div key={t.id} className={`adm-toast ${t.tone}`}>
            {TOAST_ICONS[t.tone]}
            <div style={{ flex: 1 }}>
              <b>{t.title}</b>
              {t.body && <small>{t.body}</small>}
            </div>
            <button className="x" onClick={() => setToasts((x) => x.filter((y) => y.id !== t.id))}>×</button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Modal & confirm destruktif (T2b) ---------- */
export function Modal({ open, onClose, danger, children }) {
  if (!open) return null
  return (
    <div className="adm-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`adm-modal ${danger ? 'danger' : ''}`}>{children}</div>
    </div>
  )
}

export function ConfirmDanger({ open, title, body, reasonLabel, reason, onReason, confirmLabel, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} danger>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%', flex: 'none',
          background: 'rgba(201,124,124,.12)', border: '1px solid rgba(201,124,124,.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 16 16">
            <path d="M8 2L1.5 13h13z" fill="none" stroke="#c97c7c" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M8 6.5v3M8 11.5v.3" stroke="#c97c7c" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div style={{ font: "700 16px 'Space Grotesk'" }}>{title}</div>
          <div style={{ font: '400 12px/1.6 Inter', color: 'var(--mut)', marginTop: 6 }}>{body}</div>
        </div>
      </div>
      {reasonLabel && (
        <div style={{ marginTop: 16 }}>
          <span className="adm-label">{reasonLabel}</span>
          <textarea className="adm-textarea" value={reason} onChange={(e) => onReason?.(e.target.value)} placeholder="Tanggal bentrok dengan pesanan lain…" />
        </div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' }}>
        <button className="adm-btn ghost" onClick={onClose}>BATAL</button>
        <button className="adm-btn danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Modal>
  )
}

/* ---------- Page header ---------- */
export function PageTitle({ children, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, gap: 12, flexWrap: 'wrap' }}>
      <h1 className="adm-h1" style={{ margin: 0 }}>{children}</h1>
      {right}
    </div>
  )
}

/* ---------- Avatar inisial ---------- */
const AVATAR_BG = {
  gold: 'linear-gradient(135deg,#8a6a38,#c9a26a)',
  purple: 'linear-gradient(135deg,#6a568a,#a68fc9)',
  blue: 'linear-gradient(135deg,#4a6a8a,#86a9c9)',
  gray: '#2a251e',
}
export function Avatar({ name, hue = 'gold' }) {
  return (
    <span className="adm-avatar" style={{ background: AVATAR_BG[hue] || AVATAR_BG.gold, color: hue === 'gray' ? '#6f6355' : '#141210' }}>
      {name?.[0]?.toUpperCase() || '?'}
    </span>
  )
}
