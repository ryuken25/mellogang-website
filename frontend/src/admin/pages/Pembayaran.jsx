import { useMemo, useState } from 'react'
import { initialPayments, rpFull } from '../data'
import { Badge, PageTitle, Pills, useToast } from '../ui'

const FILTERS = [
  { key: 'PENDING', label: 'PENDING', tone: 'gold' },
  { key: 'VALID', label: 'VALID', tone: 'green' },
  { key: 'INVALID', label: 'INVALID', tone: 'red' },
]

export default function Pembayaran() {
  const toast = useToast()
  const [payments, setPayments] = useState(initialPayments)
  const [filter, setFilter] = useState('PENDING')
  const [selId, setSelId] = useState(initialPayments.find((p) => p.status === 'PENDING')?.id ?? null)

  const shown = useMemo(() => payments.filter((p) => p.status === filter), [payments, filter])
  const counts = useMemo(() => {
    const c = {}
    for (const p of payments) c[p.status] = (c[p.status] || 0) + 1
    return c
  }, [payments])
  const sel = payments.find((p) => p.id === selId && p.status === filter) || shown[0] || null

  const decide = (p, status) => {
    setPayments((ps) => ps.map((x) => (x.id === p.id ? { ...x, status } : x)))
    if (status === 'VALID') toast('green', 'Pembayaran divalidasi', `${p.order} → DIBAYAR · email invoice terkirim`)
    else toast('red', 'Bukti ditolak', `${p.order} — klien diminta upload ulang`)
    setSelId(null)
  }

  const pillItems = FILTERS.map((f) => ({ ...f, label: counts[f.key] ? `${f.label} (${counts[f.key]})` : f.label }))

  return (
    <>
      <PageTitle>VERIFIKASI PEMBAYARAN</PageTitle>
      <Pills items={pillItems} value={filter} onChange={(k) => { setFilter(k); setSelId(null) }} />

      <div className="adm-pay-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shown.map((p) => {
            const midtrans = p.gateway === 'midtrans'
            const active = sel?.id === p.id
            return (
              <div
                key={p.id}
                onClick={() => !midtrans && setSelId(p.id)}
                className="adm-card"
                style={{
                  padding: '16px 18px', display: 'flex', gap: 14, alignItems: 'center',
                  cursor: midtrans ? 'default' : 'pointer',
                  opacity: midtrans || p.status !== 'PENDING' ? 0.75 : 1,
                  border: active ? '1px solid #c9a26a' : undefined,
                  background: active ? 'rgba(201,162,106,.06)' : undefined,
                }}
              >
                <div className="adm-thumb" style={{ width: 56, height: 56 }}>
                  {p.bukti ? (
                    <img src={p.bukti} alt="bukti" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 17l4-8 3 5 2-3 4 6z" fill="none" stroke="#6f6355" strokeWidth="1.4" strokeLinejoin="round" /><rect x="2.5" y="4.5" width="19" height="15" rx="2" fill="none" stroke="#6f6355" strokeWidth="1.4" /></svg>
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className="adm-code">{p.order}</span>
                    <Badge status={p.status} className="" />
                    {midtrans
                      ? <Badge tone="blue">⚡ OTOMATIS — MIDTRANS</Badge>
                      : <Badge tone="outline">MANUAL</Badge>}
                  </div>
                  <div style={{ font: '400 11.5px Inter', color: midtrans ? 'var(--faint)' : 'var(--mut)', marginTop: 4 }}>
                    {p.klien} · {rpFull(p.nominal)} · {p.metode} · {midtrans ? 'settle otomatis, read-only' : `upload ${p.umur}`}
                  </div>
                </div>
                {active && !midtrans && <span style={{ font: "600 10px 'Space Grotesk'", letterSpacing: '.12em', color: 'var(--gold)', whiteSpace: 'nowrap' }}>DIPILIH ›</span>}
              </div>
            )
          })}
          {shown.length === 0 && <div className="adm-card adm-empty">Kosong — nggak ada pembayaran {filter.toLowerCase()}.</div>}
        </div>

        {sel && sel.gateway !== 'midtrans' && sel.status === 'PENDING' && (
          <div className="adm-card" style={{ padding: 20, height: 'fit-content', borderColor: 'rgba(226,203,168,.2)' }}>
            <div style={{ font: "600 11px 'Space Grotesk'", letterSpacing: '.16em', marginBottom: 14 }}>BUKTI — {sel.order}</div>
            <div style={{ height: 280, borderRadius: 5, overflow: 'hidden', position: 'relative', background: '#1c1712' }}>
              {sel.bukti && <img src={sel.bukti} alt="preview bukti transfer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              <span style={{ position: 'absolute', right: 10, top: 10, background: 'rgba(13,11,9,.8)', border: '1px solid rgba(226,203,168,.3)', color: 'var(--gold-2)', font: "600 8px 'Space Grotesk'", letterSpacing: '.14em', padding: '5px 10px', borderRadius: 99 }}>🔍 PERBESAR</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, font: '400 11.5px Inter', color: 'var(--text-2)', margin: '14px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--faint)' }}>Nominal transfer</span><span style={{ color: 'var(--gold-2)', fontWeight: 600 }}>{rpFull(sel.nominal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--faint)' }}>Tagihan</span><span>{rpFull(sel.nominal)} ✓ cocok</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--faint)' }}>Bank pengirim</span><span>{sel.pengirim}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--faint)' }}>Waktu upload</span><span>{sel.waktu}</span></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className="adm-btn green" style={{ padding: 13 }} onClick={() => decide(sel, 'VALID')}>✓ VALID</button>
              <button className="adm-btn outline-red" style={{ padding: 13 }} onClick={() => decide(sel, 'INVALID')}>✕ TOLAK</button>
            </div>
            <div style={{ font: '400 10px Inter', color: 'var(--faint)', marginTop: 10 }}>
              Valid → status pesanan otomatis jadi DIBAYAR + email invoice ke klien.
            </div>
          </div>
        )}
      </div>

      <style>{`@media (max-width: 1100px){ .adm-pay-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
