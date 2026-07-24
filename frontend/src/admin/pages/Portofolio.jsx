import { useState } from 'react'
import { Link } from 'react-router-dom'
import { initialPortfolio } from '../data'
import { ConfirmDanger, PageTitle, useToast } from '../ui'

export default function Portofolio() {
  const toast = useToast()
  const [items, setItems] = useState(initialPortfolio)
  const [del, setDel] = useState(null)

  const doDelete = () => {
    setItems((xs) => xs.filter((x) => x.id !== del.id))
    toast('red', 'Item dihapus', del.judul)
    setDel(null)
  }

  const addManual = () => {
    const id = Math.max(0, ...items.map((x) => x.id)) + 1
    setItems((xs) => [...xs, { id, judul: `Item baru #${id}`, kategori: 'CREATIVE', sumber: 'manual · baru', img: '/brand/mellogang-og.jpg' }])
    toast('green', 'Item ditambahkan', 'Lengkapi judul & kategori lewat EDIT')
  }

  return (
    <>
      <PageTitle
        right={
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link to="/admin/social" className="adm-btn ghost-gold" style={{ padding: '11px 16px' }}>↻ SYNC DARI IG</Link>
            <button className="adm-btn primary" style={{ padding: '11px 18px' }} onClick={addManual}>+ TAMBAH MANUAL</button>
          </div>
        }
      >
        PORTOFOLIO
      </PageTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
        {items.map((it) => (
          <div key={it.id} className="adm-card" style={{ overflow: 'hidden' }}>
            <div style={{ height: 150, position: 'relative', background: '#1c1712' }}>
              <img src={it.img} alt={it.judul} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <span style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(13,11,9,.8)', color: 'var(--gold-2)', font: "600 7.5px 'Space Grotesk'", letterSpacing: '.14em', padding: '4px 8px', borderRadius: 99 }}>{it.kategori}</span>
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ font: '500 12px Inter', color: '#e8ddc9' }}>{it.judul}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ font: '400 9.5px Inter', color: 'var(--faint)' }}>{it.sumber}</span>
                <span style={{ display: 'flex', gap: 9 }}>
                  <button className="adm-link" style={{ fontSize: 8.5 }} onClick={() => toast('gold', 'Edit item', it.judul)}>EDIT</button>
                  <button className="adm-link red" style={{ fontSize: 8.5 }} onClick={() => setDel(it)}>HAPUS</button>
                </span>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addManual}
          style={{ border: '1.5px dashed rgba(201,162,106,.45)', background: 'none', borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 210, cursor: 'pointer' }}
        >
          <span style={{ font: "700 26px 'Space Grotesk'", color: 'var(--gold)' }}>+</span>
          <span style={{ font: "600 10px 'Space Grotesk'", letterSpacing: '.16em', color: 'var(--mut)' }}>TAMBAH ITEM</span>
        </button>
      </div>

      <ConfirmDanger
        open={!!del}
        title={`Hapus "${del?.judul}"?`}
        body="Item hilang dari galeri portofolio publik. Media asli di IG nggak ikut kehapus."
        confirmLabel="YA, HAPUS ITEM"
        onConfirm={doDelete}
        onClose={() => setDel(null)}
      />
    </>
  )
}
