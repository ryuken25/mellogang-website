import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, MessageCircle, X } from 'lucide-react'
import { brand } from '../../data/brandData'
export default function PortfolioModal({ item, items, onClose, onNavigate }) {
  useEffect(() => { const onKey=e=>{ if(e.key==='Escape') onClose(); if(e.key==='ArrowRight') onNavigate(1); if(e.key==='ArrowLeft') onNavigate(-1) }; window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey) }, [onClose,onNavigate])
  if (!item) return null
  const isYoutube = item.type === 'youtube' && item.embedUrl
  return <div className="fixed inset-0 z-[90] grid place-items-center bg-black/82 p-3 backdrop-blur-2xl" onClick={onClose}>
    <div className="relative max-h-[94vh] w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-2xl" onClick={e=>e.stopPropagation()}>
      <button className="absolute right-4 top-4 z-10 rounded-full bg-black/65 p-3 text-white backdrop-blur-xl" onClick={onClose}><X/></button>
      <div className="grid lg:grid-cols-[1.25fr_.75fr]">
        <div className="min-h-[360px] bg-black">{isYoutube ? <iframe className="aspect-video h-full min-h-[360px] w-full" src={item.embedUrl} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/> : <img src={item.thumbnail} alt={item.title} className="h-full max-h-[82vh] w-full object-cover"/>}</div>
        <div className="p-6 sm:p-8"><p className="eyebrow">{item.source} · {item.category}</p><h3 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-cream sm:text-5xl">{item.title}</h3><p className="mt-5 text-sm leading-7 text-cream/68">{item.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">{item.tags?.map(t=><span key={t} className="badge">{t}</span>)}</div>
          <dl className="mt-7 grid grid-cols-2 gap-3 text-sm"><div className="rounded-2xl bg-white/5 p-4"><dt className="text-cream/40">Mood</dt><dd className="mt-1 text-cream">{item.mood || 'Cinematic'}</dd></div><div className="rounded-2xl bg-white/5 p-4"><dt className="text-cream/40">Year</dt><dd className="mt-1 text-cream">{item.year}</dd></div></dl>
          <div className="mt-8 flex flex-col gap-3"><a className="btn-primary" href={item.url} target="_blank" rel="noreferrer">{item.ctaLabel || 'Open Work'} <ExternalLink size={16}/></a><a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/>Book Similar Concept</a></div>
          <div className="mt-8 flex justify-between"><button className="btn-secondary" onClick={()=>onNavigate(-1)}><ArrowLeft size={16}/>Prev</button><button className="btn-secondary" onClick={()=>onNavigate(1)}>Next<ArrowRight size={16}/></button></div>
        </div>
      </div>
    </div>
  </div>
}
