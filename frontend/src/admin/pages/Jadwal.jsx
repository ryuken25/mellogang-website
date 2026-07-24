import { useState } from 'react'
import { calendarOct, editors, initialDeliverables, initialUnscheduled } from '../data'
import { Badge, useToast } from '../ui'

export default function Jadwal() {
  const toast = useToast()
  const [unsched, setUnsched] = useState(initialUnscheduled)
  const [delivs, setDelivs] = useState(initialDeliverables)
  const [editor, setEditor] = useState(editors[0].id)
  const [shoot, setShoot] = useState('2026-10-30')
  const [target, setTarget] = useState('2026-11-13')

  const save = (item) => {
    const ed = editors.find((e) => e.id === Number(editor))
    setUnsched((u) => u.filter((x) => x.order !== item.order))
    toast('green', `${item.order} dijadwalkan`, `${ed.nama} dinotif · shooting ${shoot}`)
  }

  const send = (d) => {
    setDelivs((ds) => ds.map((x) => (x.order === d.order ? { ...x, sent: true } : x)))
    toast('green', 'Email "hasil siap" terkirim', `${d.order} · link Drive ke klien — idempotent, sekali kirim`)
  }

  const expand = (order) => setUnsched((u) => u.map((x) => (x.order === order ? { ...x, open: true } : x)))

  return (
    <>
      <h1 className="adm-h1" style={{ marginBottom: 20 }}>PENJADWALAN PRODUKSI</h1>

      <div className="adm-jdw-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(320px,400px) minmax(0,1fr)', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Belum dijadwalkan */}
          <div style={{ border: '1px solid rgba(166,143,201,.4)', background: 'rgba(166,143,201,.05)', borderRadius: 6, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ font: "600 11px 'Space Grotesk'", letterSpacing: '.14em', color: 'var(--purple-2)' }}>BELUM DIJADWALKAN</span>
              <span style={{ background: 'var(--purple)', color: '#141210', font: '700 9px ui-monospace,monospace', padding: '2px 8px', borderRadius: 99 }}>{unsched.length}</span>
            </div>

            {unsched.map((item) =>
              item.open ? (
                <div key={item.order} className="adm-card" style={{ padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="adm-code">{item.order}</span>
                    <span style={{ font: '400 10px Inter', color: 'var(--faint)' }}>{item.lunas}</span>
                  </div>
                  <div style={{ font: '400 11.5px Inter', color: 'var(--text-2)', margin: '5px 0 12px' }}>
                    {item.paket} · {item.klien} · {item.tgl} · {item.lokasi}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                    <div>
                      <span className="adm-label" style={{ fontSize: 8.5, letterSpacing: '.16em', marginBottom: 5 }}>ASSIGN EDITOR</span>
                      <select className="adm-select" value={editor} onChange={(e) => setEditor(e.target.value)}>
                        {editors.map((e) => (
                          <option key={e.id} value={e.id}>{e.nama} — {e.aktif} tugas aktif</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
                      <div>
                        <span className="adm-label" style={{ fontSize: 8.5, letterSpacing: '.16em', marginBottom: 5 }}>TGL SHOOTING</span>
                        <input className="adm-input" type="date" value={shoot} onChange={(e) => setShoot(e.target.value)} />
                      </div>
                      <div>
                        <span className="adm-label" style={{ fontSize: 8.5, letterSpacing: '.16em', marginBottom: 5 }}>TARGET SELESAI</span>
                        <input className="adm-input" type="date" value={target} onChange={(e) => setTarget(e.target.value)} />
                      </div>
                    </div>
                    <button className="adm-btn primary" style={{ width: '100%', padding: 12, fontSize: 10, letterSpacing: '.14em' }} onClick={() => save(item)}>
                      SIMPAN JADWAL → EDITOR DINOTIF
                    </button>
                  </div>
                </div>
              ) : (
                <div key={item.order} className="adm-card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="adm-code" style={{ fontSize: 11 }}>{item.order}</span>
                    <div style={{ font: '400 10.5px Inter', color: 'var(--faint)', marginTop: 2 }}>{item.paket} · {item.klien} · {item.tgl}</div>
                  </div>
                  <button className="adm-link purple" onClick={() => expand(item.order)}>JADWALKAN →</button>
                </div>
              ),
            )}
            {unsched.length === 0 && <div className="adm-empty" style={{ padding: '16px 0 4px' }}>Semua pesanan lunas udah terjadwal 👌</div>}
          </div>

          {/* Kirim link hasil */}
          <div style={{ border: '1px solid rgba(143,191,143,.4)', background: 'rgba(143,191,143,.05)', borderRadius: 6, padding: 20 }}>
            <div style={{ font: "600 11px 'Space Grotesk'", letterSpacing: '.14em', color: 'var(--green-2)', marginBottom: 12 }}>KIRIM LINK HASIL KE PELANGGAN</div>
            {delivs.map((d) => (
              <div key={d.order} className="adm-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="adm-code">{d.order}</span>
                  <Badge tone="green">EDITOR: DONE</Badge>
                </div>
                <div style={{ font: '400 11px Inter', color: 'var(--mut)', margin: '6px 0 10px' }}>
                  Link dari {d.editor}: <span style={{ color: 'var(--blue-2)' }}>{d.link}</span> ✓ tervalidasi
                </div>
                <button className="adm-btn green" style={{ width: '100%', padding: 12, fontSize: 10 }} disabled={d.sent} onClick={() => send(d)}>
                  {d.sent ? '✓ EMAIL TERKIRIM — TOMBOL NONAKTIF' : 'KIRIM EMAIL "HASIL SIAP" — SEKALI KIRIM'}
                </button>
                <div style={{ font: '400 9.5px Inter', color: 'var(--faint)', marginTop: 8, textAlign: 'center' }}>
                  Email otomatis + tombol jadi nonaktif setelah terkirim
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kalender overview */}
        <div style={{ border: '1px solid var(--line)', borderRadius: 6, overflow: 'hidden', height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'var(--panel)', borderBottom: '1px solid rgba(226,203,168,.12)', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ font: "600 12px 'Space Grotesk'", letterSpacing: '.1em' }}>OVERVIEW — OKTOBER 2026</span>
            <div style={{ display: 'flex', gap: 14, font: "500 9px 'Space Grotesk'", letterSpacing: '.14em', color: 'var(--faint)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--gold)' }} />SHOOTING</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--purple)' }} />EDITING</span>
            </div>
          </div>
          <div className="adm-cal">
            {calendarOct.map((c, i) => (
              <div key={i} className={c.ev ? 'has' : ''} style={c.out ? { opacity: 0.4 } : undefined}>
                {c.d}
                {c.ev?.map((e, j) => (
                  <div key={j} className={`adm-ev ${e.type}`}>{e.label}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 1100px){ .adm-jdw-grid{ grid-template-columns: 1fr !important; } }`}</style>
    </>
  )
}
