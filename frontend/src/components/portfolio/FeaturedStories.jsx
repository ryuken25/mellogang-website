import PortfolioCard from './PortfolioCard'
export default function FeaturedStories({ items, onOpen }) {
  const featured = items.filter(i => i.featured).slice(0,4)
  return <section className="section-pad pt-4"><div className="container-premium">
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="eyebrow">Featured Story</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream sm:text-6xl">Signature Frames</h2></div><p className="max-w-xl text-sm leading-7 text-cream/60">A curated opening set from real Mellogang Instagram frames and YouTube films — wedding story, ceremony moment, graduation capture, and motion storytelling.</p></div>
    <div className="grid auto-rows-[260px] gap-4 md:grid-cols-4">{featured.map((item, index)=><PortfolioCard key={item.id} item={{...item, size:index===0?'large':index===1?'wide':'medium'}} index={index} onOpen={onOpen}/>)}</div>
  </div></section>
}
