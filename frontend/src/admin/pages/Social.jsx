import { useEffect, useRef, useState } from 'react'
import { fetchHistory } from '../data'
import { Badge, useToast } from '../ui'

const COLS = '80px minmax(0,1fr) 140px 120px 130px'

export default function Social() {
  const toast = useToast()
  const [job, setJob] = useState({ running: true, done: 34, total: 60, started: '09:38' })
  const timer = useRef(null)

  useEffect(() => {
    if (!job.running) return undefined
    timer.current = setInterval(() => {
      setJob((j) => {
        if (!j.running) return j
        const done = Math.min(j.total, j.done + Math.ceil(Math.random() * 3))
        if (done >= j.total) {
          clearInterval(timer.current)
          toast('green', 'Fetch selesai', `Job #128 · ${j.total} media di-cache`)
          return { ...j, done: j.total, running: false }
        }
        return { ...j, done }
      })
    }, 1200)
    return () => clearInterval(timer.current)
  }, [job.running, toast])

  const stop = () => {
    setJob((j) => ({ ...j, running: false }))
    toast('gold', 'Job dihentikan', `#128 berhenti di ${job.done}/${job.total} media`)
  }
  const start = () => {
    setJob({ running: true, done: 0, total: 60, started: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) })
    toast('gold', 'Job fetch dimulai', 'Feed @mellogang.visuals lagi ditarik ke cache')
  }

  const pct = Math.round((job.done / job.total) * 100)

  return (
    <>
      <h1 className="adm-h1" style={{ marginBottom: 6 }}>SOCIAL FETCH</h1>
      <div style={{ font: '400 12px Inter', color: 'var(--mut)', marginBottom: 20 }}>
        Tarik feed @mellogang.visuals ke cache portofolio — bukan live scrape, aman buat rate limit.
      </div>

      {job.running && (
        <div style={{ border: '1px solid rgba(134,169,201,.45)', background: 'rgba(134,169,201,.06)', borderRadius: 6, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18, flexWrap: 'wrap' }}>
          <svg width="34" height="34" viewBox="0 0 34 34" style={{ animation: 'adm-spin 1.2s linear infinite' }}>
            <circle cx="17" cy="17" r="14" fill="none" stroke="rgba(134,169,201,.25)" strokeWidth="3" />
            <path d="M17 3a14 14 0 0 1 12.1 7" fill="none" stroke="#86a9c9" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ font: "700 15px 'Space Grotesk'" }}>JOB #128 — SEDANG JALAN</span>
              <span className="mono" style={{ font: '500 11px ui-monospace,monospace', color: 'var(--blue-2)' }}>{job.done} / {job.total} media</span>
            </div>
            <div className="adm-progress" style={{ marginTop: 10 }}><div style={{ width: `${pct}%` }} /></div>
            <div style={{ font: '400 10.5px Inter', color: 'var(--faint)', marginTop: 8 }}>
              Mulai {job.started} · est. selesai ± 2 menit · thumbnail di-download & di-cache lokal
            </div>
          </div>
          <button className="adm-btn outline-red" style={{ padding: '10px 16px', fontSize: 9.5 }} onClick={stop}>HENTIKAN</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="adm-btn primary" disabled={job.running} onClick={start}>⟳ FETCH DARI INSTAGRAM</button>
        <span style={{ font: '400 10.5px Inter', color: 'var(--faint)' }}>
          {job.running ? 'nonaktif selama job jalan · ' : ''}terakhir sukses: kemarin 18:02
        </span>
      </div>

      <div className="adm-sec">RIWAYAT FETCH</div>
      <div className="adm-table">
        <div className="adm-tr head adm-soc-cols" style={{ gridTemplateColumns: COLS, padding: '11px 18px' }}>
          <span>JOB</span><span>WAKTU</span><span>MEDIA BARU</span><span>DURASI</span><span>STATUS</span>
        </div>
        {fetchHistory.map((h) => (
          <div key={h.job} className="adm-tr adm-soc-cols" style={{ gridTemplateColumns: COLS, padding: '13px 18px' }}>
            <span className="adm-code" style={{ fontSize: 11 }}>{h.job}</span>
            <span className="adm-cell" style={{ fontSize: 12 }}>{h.waktu}</span>
            <span className="adm-cell" style={{ fontSize: 12 }}>{h.media}</span>
            <span className="adm-cell" style={{ fontSize: 12 }}>{h.durasi}</span>
            <span>{h.status === 'SUKSES' ? <Badge tone="green">SUKSES</Badge> : <Badge tone="red">{h.status}</Badge>}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes adm-spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px){ .adm-soc-cols{ grid-template-columns: 50px minmax(0,1fr) 110px !important; } .adm-soc-cols > :nth-child(3), .adm-soc-cols > :nth-child(4){ display:none; } }
      `}</style>
    </>
  )
}
