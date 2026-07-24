import { useState } from 'react'
import { initialPackages, rp } from '../data'
import { Badge, ConfirmDanger, Modal, PageTitle, useToast } from '../ui'

const COLS = '64px minmax(0,1fr) 130px 110px 100px 130px'
const KATEGORI = ['Wedding', 'Prewedding', 'Ceremony', 'Graduation', 'Event', 'Creative']

const emptyForm = { nama: '', kategori: 'Wedding', harga: '', deskripsi: '', aktif: true }

export default function Katalog() {
  const toast = useToast()
  const [packages, setPackages] = useState(initialPackages)
  const [modal, setModal] = useState(null) // { mode: 'create'|'edit', data }
  const [del, setDel] = useState(null)

  const openCreate = () => setModal({ mode: 'create', data: { ...emptyForm } })
  const openEdit = (p) => setModal({ mode: 'edit', data: { ...p, harga: String(p.harga) } })
  const setF = (k, v) => setModal((m) => ({ ...m, data: { ...m.data, [k]: v } }))

  const save = () => {
    const d = modal.data
    if (!d.nama.trim() || !d.harga) { toast('red', 'Form belum lengkap', 'Nama paket dan harga wajib diisi'); return }
    const harga = parseInt(String(d.harga).replace(/\D/g, ''), 10) || 0
    if (modal.mode === 'create') {
      setPackages((ps) => [...ps, { ...d, id: Math.max(...ps.map((p) => p.id)) + 1, harga, sub: d.deskripsi.split('·')[0]?.trim() || '', thumb: '/brand/mellogang-og.jpg' }])
      toast('green', 'Paket ditambahkan', `${d.nama} · ${rp(harga)}`)
    } else {
      setPackages((ps) => ps.map((p) => (p.id === d.id ? { ...p, ...d, harga } : p)))
      toast('green', 'Paket disimpan', d.nama)
    }
    setModal(null)
  }

  const toggle = (p) => {
    setPackages((ps) => ps.map((x) => (x.id === p.id ? { ...x, aktif: !x.aktif } : x)))
    toast(p.aktif ? 'gold' : 'green', p.aktif ? 'Paket dinonaktifkan' : 'Paket diaktifkan', `${p.nama} ${p.aktif ? 'disembunyikan dari' : 'tampil di'} katalog publik`)
  }

  const doDelete = () => {
    setPackages((ps) => ps.filter((p) => p.id !== del.id))
    toast('red', 'Paket dihapus', del.nama)
    setDel(null)
  }

  return (
    <>
      <PageTitle right={<button className="adm-btn primary" style={{ padding: '11px 18px' }} onClick={openCreate}>+ TAMBAH PAKET</button>}>
        KATALOG LAYANAN
      </PageTitle>

      <div className="adm-table">
        <div className="adm-tr head adm-kat-cols" style={{ gridTemplateColumns: COLS }}>
          <span /><span>PAKET</span><span>KATEGORI</span><span>HARGA</span><span>STATUS</span><span>AKSI</span>
        </div>
        {packages.map((p) => (
          <div key={p.id} className="adm-tr adm-kat-cols" style={{ gridTemplateColumns: COLS, opacity: p.aktif ? 1 : 0.6 }}>
            <div className="adm-thumb" style={{ width: 48, height: 34 }}><img src={p.thumb} alt="" /></div>
            <span className="adm-cell"><b>{p.nama}</b><span className="dim" style={{ fontSize: 11 }}> · {p.sub}</span></span>
            <span className="adm-cell">{p.kategori}</span>
            <span style={{ font: "500 12px 'Space Grotesk'", color: p.aktif ? 'var(--gold-2)' : 'var(--mut)' }}>{rp(p.harga)}</span>
            <span>{p.aktif ? <Badge tone="green">AKTIF</Badge> : <Badge tone="gray">NONAKTIF</Badge>}</span>
            <span style={{ display: 'flex', gap: 11 }}>
              <button className="adm-link" onClick={() => openEdit(p)}>EDIT</button>
              {p.aktif
                ? <button className="adm-link red" onClick={() => setDel(p)}>HAPUS</button>
                : <button className="adm-link green" onClick={() => toggle(p)}>AKTIFKAN</button>}
            </span>
          </div>
        ))}
      </div>

      {/* form modal (T5b) */}
      <Modal open={!!modal} onClose={() => setModal(null)}>
        {modal && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ font: "700 17px 'Space Grotesk'" }}>
                {modal.mode === 'create' ? 'TAMBAH PAKET' : `EDIT PAKET — ${modal.data.nama}`}
              </span>
              <button onClick={() => setModal(null)} style={{ background: 'none', border: 0, cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="#6f6355" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="adm-label">NAMA PAKET</span>
                <input className="adm-input" value={modal.data.nama} onChange={(e) => setF('nama', e.target.value)} />
              </div>
              <div>
                <span className="adm-label">KATEGORI</span>
                <select className="adm-select" value={modal.data.kategori} onChange={(e) => setF('kategori', e.target.value)}>
                  {KATEGORI.map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <span className="adm-label">HARGA MULAI (RP)</span>
                <input className="adm-input mono" style={{ color: 'var(--gold-2)' }} value={modal.data.harga} onChange={(e) => setF('harga', e.target.value)} placeholder="4.500.000" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="adm-label">DESKRIPSI / DELIVERABLES</span>
                <textarea className="adm-textarea" value={modal.data.deskripsi} onChange={(e) => setF('deskripsi', e.target.value)} placeholder="Film 4-6 menit (4K) · 300+ foto edited · same-day teaser · drone · 2x revisi minor" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <span className="adm-label">GALERI CONTOH</span>
                <div style={{ display: 'flex', gap: 9 }}>
                  <div className="adm-thumb" style={{ width: 86, height: 58, borderRadius: 4 }}><img src="/brand/mellogang-og.jpg" alt="g1" /></div>
                  <div className="adm-thumb" style={{ width: 86, height: 58, borderRadius: 4 }}><img src="/brand/mellogang-og.jpg" alt="g2" /></div>
                  <div style={{ width: 86, height: 58, border: '1.5px dashed rgba(201,162,106,.5)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', font: "600 20px 'Space Grotesk'", color: 'var(--gold)', cursor: 'pointer' }}>+</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, gap: 10, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 11px Inter', color: 'var(--text-2)', cursor: 'pointer' }} onClick={() => setF('aktif', !modal.data.aktif)}>
                <span className={`adm-switch ${modal.data.aktif ? 'on' : ''}`} />
                Paket aktif — tampil di katalog
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="adm-btn ghost" onClick={() => setModal(null)}>BATAL</button>
                <button className="adm-btn primary" onClick={save}>SIMPAN PAKET</button>
              </div>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDanger
        open={!!del}
        title={`Hapus paket "${del?.nama}"?`}
        body="Paket hilang dari katalog publik. Pesanan lama yang pakai paket ini tetap utuh."
        confirmLabel="YA, HAPUS PAKET"
        onConfirm={doDelete}
        onClose={() => setDel(null)}
      />

      <style>{`@media (max-width: 900px){ .adm-kat-cols{ grid-template-columns: 48px minmax(0,1fr) 90px !important; } .adm-kat-cols > :nth-child(3), .adm-kat-cols > :nth-child(5){ display:none; } }`}</style>
    </>
  )
}
