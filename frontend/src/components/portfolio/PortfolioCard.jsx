import { ExternalLink, Film, Image as ImageIcon, Play } from 'lucide-react'
const badgeIcon = { YouTube: Play, Instagram: ImageIcon }
export default function PortfolioCard({ item, index = 0, onOpen }) {
  const Icon = badgeIcon[item.source] || Film
  const sizeClass = item.size === 'large' ? 'md:col-span-2 md:row-span-2 min-h-[560px]' : item.size === 'wide' ? 'md:col-span-2 min-h-[360px]' : item.size === 'tall' ? 'min-h-[520px]' : 'min-h-[360px]'
  return <button onClick={() => onOpen(item)} className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.045] text-left shadow-soft ${sizeClass}`}>
    <img src={item.thumbnail} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90" />
    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
      <div className="mb-3 flex flex-wrap gap-2"><span className="badge bg-black/35"><Icon size={13}/> {item.source}</span><span className="badge bg-black/35">{item.type}</span></div>
      <p className="text-xs font-semibold uppercase tracking-[.28em] text-gold">{item.category}</p>
      <h3 className="mt-2 text-2xl font-semibold tracking-[-.03em] text-white sm:text-3xl">{item.title}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">{item.description}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-gold">{item.ctaLabel || 'Open Work'} <ExternalLink size={15}/></div>
    </div>
  </button>
}
