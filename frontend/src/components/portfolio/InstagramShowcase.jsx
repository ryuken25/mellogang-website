import { AtSign, ExternalLink } from 'lucide-react'
import { brand } from '../../data/brandData'
export default function InstagramShowcase({ items, onOpen }) {
  const ig = items.filter(i => i.source === 'Instagram')
  return <section className="section-pad pt-0"><div className="container-premium"><div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">From the Instagram Feed</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream sm:text-5xl">Real Frames from Mellogang</h2></div><a className="btn-secondary" href={brand.instagram} target="_blank" rel="noreferrer">See more on Instagram <ExternalLink size={16}/></a></div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{ig.map(item=><button key={item.id} onClick={()=>onOpen(item)} className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10"><img src={item.thumbnail} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent opacity-0 transition group-hover:opacity-100"/><AtSign className="absolute bottom-4 left-4 text-gold opacity-0 transition group-hover:opacity-100"/></button>)}</div>
  </div></section>
}
