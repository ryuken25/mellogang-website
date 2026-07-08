import SmartImage from '../SmartImage'
const aspectClass = { portrait:'aspect-[4/5]', wide:'aspect-[16/10]', video:'aspect-video', square:'aspect-square' }
export default function PortfolioCard({ item, onOpen }) {
  return <button onClick={() => onOpen(item)} className="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[.045] text-left transition hover:scale-[1.015]">
    <div className={`relative overflow-hidden ${aspectClass[item.aspect] || 'aspect-[4/5]'}`}><SmartImage src={item.thumbnail} alt={item.title} objectPosition={item.objectPosition}/><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-90"/><div className="absolute bottom-4 left-4 right-4"><div className="mb-2 flex flex-wrap gap-2"><span className="badge bg-black/35">{item.category}</span><span className="badge bg-black/35">{item.source}</span></div><h3 className="text-2xl font-semibold tracking-[-.03em] text-white">{item.title}</h3></div></div>
    <div className="p-5"><p className="line-clamp-2 text-sm leading-6 text-cream/65">{item.description}</p></div>
  </button>
}
