import { useMemo, useState } from 'react'
import { initialOrders, rp } from '../data'
import { Badge, ConfirmDanger, PageTitle, Pills, useToast } from '../ui'

const FILTERS = [
  { key: 'ALL', label: 'SEMUA', tone: '' },
  { key: 'BARU', label: 'BARU', tone: 'gold' },
  { key: 'MENUNGGU_BAYAR', label: 'MENUNGGU BAYAR', tone: 'gold' },
  { key: 'PRODUKSI', label: 'PRODUKSI', tone: 'purple' },
  { key: 'SELESAI', label: 'SELESAI', tone: 'green' },
  { key: 'BATAL', label: 'BATAL', tone: 'gray' },
]

const COLS = '100px minmax(0,1fr) 130px 100px 150px 190px'

export default function Pemesanan() {
  const toast = useToast()
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState('ALL')
  const [q, setQ] = useState('')
  const [reject, setReject] = useState(null)
  const [reason, setReason] = useState('')

  const shown = useMemo(() => {
    let r = orders
    if (filter !== 'ALL') r = r.filter((o) => o.status === filter)
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      r = r.filter((o) => o.id.toLowerCase().includes(s) || o.klien.toLowerCase().includes(s))
    }
    return r
  }, [orders, filter, q])

  const counts = useMemo(() => {
    const c = { ALL: orders.length }
    for (const o of orders) c[o.status] = (c[o.status] || 0) + 1
    return c
  }, [orders])

  const setStatus = (id, status) => setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)))

  const accept = (o) => {
    setStatus(o.id, 'MENUNGGU_BAYAR')
    toast('green', `${o.id} diterima`, 'Klien dapet email + instruksi pembayaran')
  }
  const doReject = () => {
    setStatus(reject.id, 'BATAL')
    toast('red', `${reject.id} ditolak`, 'Email penolakan terkirim ke klien')
    setReject(null); setReason('')
  }
  const cancel = (o) => {
    setStatus(o.id, 'BATAL')
    toast('gold', `${o.id} dibatalkan`, 'Slot tanggal dibuka lagi')
  }

  const pillItems = FILTERS.map((f) => ({ ...f, label: counts[f.key] ? `${f.label} (${counts[f.key]})` : f.label }))

  return (
    <>
      <PageTitle
        right={
          <div className="adm-search">
            <svg width="13" height="13" viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.6" fill="none" stroke="#6f6355" strokeWidth="1.4" /><path d="M10.5 10.5L14 14" stroke="#6f6355" strokeWidth="1.4" strokeLinecap="round" /></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kode / nama klien…" />
          </div>
        }
      >
        KELOLA PESANAN
      </PageTitle>

      <Pills items={pillItems} value={filter} onChange={setFilter} />

      {/* desktop table */}
      <div className="adm-table adm-hide-sm">
        <div className="adm-tr head" style={{ gridTemplateColumns: COLS }}>
          <span>KODE</span><span>KLIEN / PAKET</span><span>TGL ACARA</span><span>TOTAL</span><span>STATUS</span><span>AKSI</span>
        </div>
        {shown.map((o) => (
          <div key={o.id} className={`adm-tr ${o.status === 'BARU' ? 'hi' : ''}`} style={{ gridTemplateColumns: COLS }}>
            <span className="adm-code">{o.id}</span>
            <span className="adm-cell"><b>{o.klien}</b> · {o.paket}</span>
            <span className="adm-cell">{o.tglAcara}</span>
            <span className="adm-cell">{rp(o.total)}</span>
            <span><Badge status={o.status} /></span>
            <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
              {o.status === 'BARU' && (
                <>
                  <button className="adm-btn green sm" onClick={() => accept(o)}>TERIMA</button>
                  <button className="adm-btn outline-red sm" onClick={() => setReject(o)}>TOLAK</button>
                </>
              )}
              {o.status === 'MENUNGGU_BAYAR' && (
                <>
                  {o.timer && <span className="mono" style={{ font: '500 10px ui-monospace,monospace', color: 'var(--gold-2)' }}>⏱ {o.timer}</span>}
                  <button className="adm-btn outline-gray sm" onClick={() => cancel(o)}>BATALKAN</button>
                </>
              )}
              {!['BARU', 'MENUNGGU_BAYAR'].includes(o.status) && <button className="adm-link">DETAIL →</button>}
            </span>
          </div>
        ))}
        {shown.length === 0 && <div className="adm-empty">Nggak ada pesanan yang cocok.</div>}
      </div>

      {/* mobile cards */}
      <div className="adm-only-sm" style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
        {shown.map((o) => (
          <div key={o.id} className="adm-card" style={{ padding: 14, borderColor: o.status === 'BARU' ? 'rgba(201,162,106,.4)' : undefined }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="adm-code" style={{ fontWeight: 700 }}>{o.id}</span>
              <Badge status={o.status} />
            </div>
            <div className="adm-cell" style={{ fontSize: 11.5, marginTop: 5 }}>{o.klien} · {o.paket} · {o.tglAcara}</div>
            {o.status === 'BARU' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <button className="adm-btn green sm" style={{ padding: 11 }} onClick={() => accept(o)}>TERIMA</button>
                <button className="adm-btn outline-red sm" style={{ padding: 11 }} onClick={() => setReject(o)}>TOLAK</button>
              </div>
            )}
          </div>
        ))}
        {shown.length === 0 && <div className="adm-empty">Nggak ada pesanan yang cocok.</div>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, font: '400 11px Inter', color: 'var(--faint)' }}>
        <span>{shown.length} dari {orders.length}</span>
      </div>

      <ConfirmDanger
        open={!!reject}
        title={`Tolak pesanan ${reject?.id}?`}
        body="Klien bakal dapet email penolakan. Aksi ini nggak bisa dibalikin."
        reasonLabel="ALASAN (DIKIRIM KE KLIEN)"
        reason={reason}
        onReason={setReason}
        confirmLabel="YA, TOLAK PESANAN"
        onConfirm={doReject}
        onClose={() => { setReject(null); setReason('') }}
      />

      <style>{`
        @media (max-width: 900px){ .adm-hide-sm{ display:none; } }
        @media (min-width: 901px){ .adm-only-sm{ display:none !important; } }
      `}</style>
    </>
  )
}
