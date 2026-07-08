import { Play, ExternalLink } from 'lucide-react'
import { brand } from '../../data/brandData'
export default function YoutubeShowcase({ items, onOpen }) {
  const yt = items.filter(i => i.source === 'YouTube').slice(0,4)
  return <section className="section-pad"><div className="container-premium"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Director’s Cut</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream sm:text-5xl">Films & Motion Stories</h2></div><a className="btn-secondary" href={brand.youtube} target="_blank" rel="noreferrer">Watch on YouTube <ExternalLink size={16}/></a></div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{yt.map(item=><button key={item.id} onClick={()=>onOpen(item)} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/[.045] text-left"><div className="relative aspect-video overflow-hidden"><img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-black"><Play/></span></div></div><div className="p-5"><p className="badge">YouTube</p><h3 className="mt-3 font-semibold text-cream">{item.title}</h3><p className="mt-2 line-clamp-2 text-sm text-cream/55">{item.description}</p></div></button>)}</div>
  </div></section>
}
