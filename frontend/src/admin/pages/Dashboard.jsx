import { Link } from 'react-router-dom'
import { revenue6m } from '../data'

const STATS = [
  { k: 'PESANAN BARU', v: '3', s: 'nunggu diterima/tolak', tone: 'rgba(201,162,106,.4)', c: '#e8caa0', to: '/admin/pemesanan' },
  { k: 'VERIFIKASI BAYAR', v: '2', s: 'bukti transfer pending', tone: 'rgba(201,124,124,.4)', c: '#dfa3a3', to: '/admin/pembayaran' },
  { k: 'PRODUKSI JALAN', v: '4', s: '2 editing · 2 nunggu jadwal', tone: 'rgba(166,143,201,.4)', c: '#c9b3e8', to: '/admin/jadwal' },
  { k: 'PENDAPATAN JUL', v: 'Rp 28.5jt', s: '▲ 12% vs Jun', tone: 'rgba(143,191,143,.4)', c: '#b3d9b3', sc: '#b3d9b3' },
]

const ACTIONS = [
  { title: 'MG-2440 baru masuk', sub: 'Wedding · 12 Nov · Canggu', cta: 'REVIEW →', tone: 'rgba(201,162,106,.35)', c: '#c9a26a', to: '/admin/pemesanan' },
  { title: 'Bukti bayar MG-2437', sub: 'manual · Rp 3jt · 2 jam lalu', cta: 'CEK →', tone: 'rgba(201,124,124,.35)', c: '#dfa3a3', to: '/admin/pembayaran' },
  { title: 'MG-2433 belum dijadwalin', sub: 'lunas 2 hari lalu', cta: 'ASSIGN →', tone: 'rgba(166,143,201,.35)', c: '#c9b3e8', to: '/admin/jadwal' },
]

export default function Dashboard() {
  const max = Math.max(...revenue6m.map((r) => r.v))
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
  const clock = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' })

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div className="adm-kicker">Command center —</div>
          <div className="adm-date">{today}</div>
        </div>
        <span className="adm-note">DATA REALTIME · {clock} WITA</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 20 }}>
        {STATS.map((s) => {
          const card = (
            <div key={s.k} className="adm-stat" style={{ border: `1px solid ${s.tone}` }}>
              <div className="k" style={{ color: s.c }}>{s.k}</div>
              <div className="v">{s.v}</div>
              <div className="s" style={s.sc ? { color: s.sc } : undefined}>{s.s}</div>
            </div>
          )
          return s.to ? <Link key={s.k} to={s.to} style={{ color: 'inherit' }}>{card}</Link> : card
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(280px,320px)', gap: 16 }} className="adm-dash-grid">
        <div className="adm-card" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ font: "600 12px 'Space Grotesk'", letterSpacing: '.12em' }}>PENDAPATAN 6 BULAN</span>
            <span className="adm-note" style={{ letterSpacing: '.16em' }}>JUTA RUPIAH</span>
          </div>
          <div className="adm-chart">
            {revenue6m.map((r) => (
              <div key={r.m} className={`adm-bar ${r.now ? 'now' : ''}`}>
                <span className="val">{r.v}</span>
                <div className="fill" style={{ height: `${Math.round((r.v / max) * 72)}%` }} />
                <span className="mon">{r.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="adm-card" style={{ padding: 20 }}>
          <div style={{ font: "600 12px 'Space Grotesk'", letterSpacing: '.12em', marginBottom: 14 }}>PERLU AKSI</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {ACTIONS.map((a) => (
              <Link key={a.title} to={a.to} style={{ color: 'inherit' }}>
                <div style={{ border: `1px solid ${a.tone}`, borderRadius: 5, padding: '11px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                  <div>
                    <div style={{ font: "600 11.5px 'Space Grotesk'" }}>{a.title}</div>
                    <div style={{ font: '400 9.5px Inter', color: 'var(--faint)' }}>{a.sub}</div>
                  </div>
                  <span style={{ font: "600 9px 'Space Grotesk'", letterSpacing: '.1em', color: a.c, whiteSpace: 'nowrap' }}>{a.cta}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 900px){ .adm-dash-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
