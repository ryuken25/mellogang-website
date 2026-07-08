import PortfolioCard from './PortfolioCard'
export default function FeaturedStories({ items, onOpen }) {
  const [main,...side] = items.filter(i => i.featured).slice(0,3)
  return <section className="section-pad pt-4"><div className="container-premium"><div className="mb-10 max-w-3xl"><p className="eyebrow">Featured Visual Story</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream sm:text-6xl">Selected moments with cinematic rhythm.</h2></div><div className="grid gap-5 lg:grid-cols-[1.45fr_.9fr]">{main&&<PortfolioCard item={{...main, aspect:'portrait'}} onOpen={onOpen}/>}<div className="grid gap-5">{side.map(item=><PortfolioCard key={item.id} item={{...item, aspect:item.aspect==='video'?'video':'wide'}} onOpen={onOpen}/>)}</div></div></div></section>
}
