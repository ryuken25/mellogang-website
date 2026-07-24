import { useMemo, useState } from 'react'
import { initialUsers } from '../data'
import { Avatar, Badge, PageTitle, Pills, useToast } from '../ui'

const FILTERS = [
  { key: 'ALL', label: 'SEMUA', tone: '' },
  { key: 'PELANGGAN', label: 'PELANGGAN', tone: 'gold' },
  { key: 'EDITOR', label: 'EDITOR', tone: 'purple' },
  { key: 'ADMIN', label: 'ADMIN', tone: 'blue' },
]

const ROLE_TONE = { PELANGGAN: 'gold', EDITOR: 'purple', ADMIN: 'blue' }
const COLS = 'minmax(0,1fr) 150px 110px 110px 190px'

export default function Pengguna() {
  const toast = useToast()
  const [users, setUsers] = useState(initialUsers)
  const [filter, setFilter] = useState('ALL')

  const shown = useMemo(() => (filter === 'ALL' ? users : users.filter((u) => u.role === filter)), [users, filter])
  const counts = useMemo(() => {
    const c = { ALL: users.length }
    for (const u of users) c[u.role] = (c[u.role] || 0) + 1
    return c
  }, [users])

  const toggle = (u) => {
    setUsers((us) => us.map((x) => (x.id === u.id ? { ...x, aktif: !x.aktif, hue: x.aktif ? 'gray' : ROLE_TONE[x.role] } : x)))
    toast(u.aktif ? 'red' : 'green', u.aktif ? 'Akun dinonaktifkan' : 'Akun diaktifkan', `${u.nama} · ${u.email}`)
  }
  const resetPass = (u) => toast('gold', 'Link reset terkirim', `Email reset password ke ${u.email}`)

  const pillItems = FILTERS.map((f) => ({ ...f, label: `${f.label} (${counts[f.key] || 0})` }))

  return (
    <>
      <PageTitle right={<button className="adm-btn primary" style={{ padding: '11px 18px' }} onClick={() => toast('gold', 'Undangan editor', 'Form undang editor — demo mode')}>+ UNDANG EDITOR</button>}>
        KELOLA PENGGUNA
      </PageTitle>

      <Pills items={pillItems} value={filter} onChange={setFilter} />

      <div className="adm-table">
        <div className="adm-tr head adm-usr-cols" style={{ gridTemplateColumns: COLS }}>
          <span>USER</span><span>TERDAFTAR</span><span>ROLE</span><span>STATUS</span><span>AKSI</span>
        </div>
        {shown.map((u) => (
          <div key={u.id} className="adm-tr adm-usr-cols" style={{ gridTemplateColumns: COLS, opacity: u.aktif ? 1 : 0.6 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
              <Avatar name={u.nama} hue={u.aktif ? u.hue : 'gray'} />
              <span style={{ minWidth: 0 }}>
                <span style={{ font: '500 12.5px Inter', color: u.aktif ? 'var(--text)' : 'var(--text-2)', display: 'block' }}>{u.nama}</span>
                <span style={{ font: '400 10.5px Inter', color: 'var(--faint)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.email}{u.via ? ` · ${u.via}` : ''}
                </span>
              </span>
            </span>
            <span className="adm-cell" style={{ fontSize: 12 }}>{u.daftar}</span>
            <span><Badge tone={ROLE_TONE[u.role]} className="" >{u.role}</Badge></span>
            <span>{u.aktif ? <Badge tone="green">AKTIF</Badge> : <Badge tone="gray">NONAKTIF</Badge>}</span>
            <span style={{ display: 'flex', gap: 11, flexWrap: 'wrap' }}>
              {u.aktif ? (
                <>
                  <button className="adm-link" style={{ fontSize: 9.5 }} onClick={() => resetPass(u)}>RESET PASS</button>
                  {u.role !== 'ADMIN' && <button className="adm-link red" style={{ fontSize: 9.5 }} onClick={() => toggle(u)}>NONAKTIFKAN</button>}
                </>
              ) : (
                <button className="adm-link green" style={{ fontSize: 9.5 }} onClick={() => toggle(u)}>AKTIFKAN</button>
              )}
            </span>
          </div>
        ))}
      </div>

      <style>{`@media (max-width: 900px){ .adm-usr-cols{ grid-template-columns: minmax(0,1fr) 100px !important; } .adm-usr-cols > :nth-child(2), .adm-usr-cols > :nth-child(3), .adm-usr-cols > :nth-child(4){ display:none; } }`}</style>
    </>
  )
}
