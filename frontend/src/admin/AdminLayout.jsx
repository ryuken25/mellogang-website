import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ToastProvider } from './ui'
import './admin.css'

const I = {
  dash: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="2" width="5" height="5" rx="1" fill={c} /><rect x="9" y="2" width="5" height="5" rx="1" fill="none" stroke={c} strokeWidth="1.2" /><rect x="2" y="9" width="5" height="5" rx="1" fill="none" stroke={c} strokeWidth="1.2" /><rect x="9" y="9" width="5" height="5" rx="1" fill="none" stroke={c} strokeWidth="1.2" /></svg>
  ),
  order: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><path d="M3 2h10v12l-2-1.5L9 14l-2-1.5L5 14l-2-1.5z" fill="none" stroke={c} strokeWidth="1.2" strokeLinejoin="round" /></svg>
  ),
  pay: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="9" rx="1.5" fill="none" stroke={c} strokeWidth="1.2" /><path d="M2 7h12" stroke={c} strokeWidth="1.2" /></svg>
  ),
  cal: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="11" rx="1.5" fill="none" stroke={c} strokeWidth="1.2" /><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke={c} strokeWidth="1.2" strokeLinecap="round" /></svg>
  ),
  box: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><path d="M2 5l6-3 6 3-6 3z" fill="none" stroke={c} strokeWidth="1.2" strokeLinejoin="round" /><path d="M2 5v6l6 3 6-3V5" fill="none" stroke={c} strokeWidth="1.2" strokeLinejoin="round" /></svg>
  ),
  img: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="1.5" fill="none" stroke={c} strokeWidth="1.2" /><circle cx="6" cy="6" r="1.4" fill={c} /><path d="M2 11l3.5-3 3 2.5L12 7l2 2" fill="none" stroke={c} strokeWidth="1.2" strokeLinejoin="round" /></svg>
  ),
  fetch: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><path d="M8 2a6 6 0 1 0 6 6" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" /><path d="M14 2l-6 6" stroke={c} strokeWidth="1.3" strokeLinecap="round" /><path d="M10.5 2H14v3.5" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  users: (c) => (
    <svg width="15" height="15" viewBox="0 0 16 16"><circle cx="5.5" cy="5.5" r="2.2" fill="none" stroke={c} strokeWidth="1.2" /><circle cx="11" cy="6.5" r="1.8" fill="none" stroke={c} strokeWidth="1.2" /><path d="M1.8 13c.6-2.2 2-3.4 3.7-3.4S8.6 10.8 9.2 13M9.5 12.6c.4-1.6 1.4-2.5 2.7-2.5 1 0 1.9.6 2.4 1.9" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" /></svg>
  ),
}

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: 'dash' },
  { to: '/admin/pemesanan', label: 'Pemesanan', icon: 'order', count: 3, tone: '' },
  { to: '/admin/pembayaran', label: 'Pembayaran', icon: 'pay', count: 2, tone: 'red' },
  { to: '/admin/jadwal', label: 'Penjadwalan', icon: 'cal' },
  { to: '/admin/katalog', label: 'Katalog Layanan', icon: 'box' },
  { to: '/admin/portofolio', label: 'Portofolio', icon: 'img' },
  { to: '/admin/social', label: 'Social Fetch', icon: 'fetch' },
  { to: '/admin/pengguna', label: 'Pengguna', icon: 'users' },
]

function Logo({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M7 42V8l17 18L41 8v34" stroke="#c9a26a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 33l8 8 8-8" stroke="#c9a26a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavList({ onNavigate }) {
  return (
    <nav className="adm-nav">
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.end} onClick={onNavigate}>
          {({ isActive }) => (
            <>
              <span className="lbl">
                {I[n.icon](isActive ? '#a8c6e0' : '#a39682')}
                {n.label}
              </span>
              {n.count != null && <span className={`adm-count ${n.tone || ''}`}>{n.count}</span>}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function SideFoot() {
  return (
    <div className="adm-side-foot">
      <div className="adm-user">
        <span className="adm-avatar" style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#8a6a38,#c9a26a)' }}>M</span>
        <div style={{ flex: 1 }}>
          <b>Mello</b>
          <small>Super Admin</small>
        </div>
        <a href="/auth" aria-label="Logout">
          <svg width="14" height="14" viewBox="0 0 16 16"><path d="M6 3H3v10h3M10 5l3 3-3 3M13 8H7" fill="none" stroke="#6f6355" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [drawer, setDrawer] = useState(false)
  useLocation() // re-render on route change (drawer NavLink active states)

  return (
    <ToastProvider>
      <div className="adm">
        <div className="adm-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Logo size={20} />
            <span className="tag">AREA <span>ADMIN</span></span>
          </div>
          <button aria-label="Menu" onClick={() => setDrawer(true)} style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h10" stroke="#e8caa0" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        {drawer && (
          <div className="adm-drawer">
            <div className="scrim" onClick={() => setDrawer(false)} />
            <div className="panel adm">
              <div className="adm-brand"><Logo /><div><b>MELLOGANG</b><small>VISUALS</small></div></div>
              <div className="adm-area">AREA <span>ADMIN</span></div>
              <NavList onNavigate={() => setDrawer(false)} />
              <SideFoot />
            </div>
          </div>
        )}

        <div className="adm-shell">
          <aside className="adm-side">
            <div className="adm-brand"><Logo /><div><b>MELLOGANG</b><small>VISUALS</small></div></div>
            <div className="adm-area">AREA <span>ADMIN</span></div>
            <NavList />
            <SideFoot />
          </aside>
          <main className="adm-main">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
