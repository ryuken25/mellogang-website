import { useMemo, useRef, useState } from 'react'
import PortfolioHero from '../components/portfolio/PortfolioHero'
import FeaturedStories from '../components/portfolio/FeaturedStories'
import PortfolioFilters from '../components/portfolio/PortfolioFilters'
import PortfolioGrid from '../components/portfolio/PortfolioGrid'
import PortfolioModal from '../components/portfolio/PortfolioModal'
import YoutubeShowcase from '../components/portfolio/YoutubeShowcase'
import InstagramShowcase from '../components/portfolio/InstagramShowcase'
import PortfolioCTA from '../components/portfolio/PortfolioCTA'
import { brand } from '../data/brandData'
import { portfolioItems } from '../data/portfolioData'

const matchesFilter = (item, filter) => {
  if (filter === 'All') return true
  if (filter === 'Instagram') return item.source === 'Instagram'
  if (filter === 'YouTube') return item.source === 'YouTube'
  if (filter === 'Film') return ['youtube','video','channel_feature'].includes(item.type) || item.tags?.includes('Film')
  if (filter === 'Photo') return ['photo','instagram'].includes(item.type)
  return item.category === filter || item.tags?.includes(filter)
}
export default function Portfolio(){
  const worksRef = useRef(null)
  const [filter,setFilter]=useState('All')
  const [active,setActive]=useState(null)
  const shown=useMemo(()=>portfolioItems.filter(item=>matchesFilter(item,filter)),[filter])
  const navigate = (dir) => { const list=shown.length?shown:portfolioItems; const idx=list.findIndex(i=>i.id===active?.id); setActive(list[(idx+dir+list.length)%list.length]) }
  return <>
    <PortfolioHero onExplore={()=>worksRef.current?.scrollIntoView({behavior:'smooth'})}/>
    <FeaturedStories items={portfolioItems} onOpen={setActive}/>
    <section ref={worksRef} className="section-pad pt-0"><div className="container-premium"><div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-3xl"><p className="eyebrow">All Works</p><h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream light:text-charcoal sm:text-6xl">Selected visual stories.</h2><p className="subtle mt-5">Browse selected weddings, ceremonies, graduations, events, and motion stories from Mellogang Visuals.</p></div><div className="flex flex-col gap-3 sm:flex-row"><a className="btn-secondary" href={brand.youtube} target="_blank" rel="noreferrer"><img src={brand.socialIcons.youtube} alt="YouTube" className="h-5 w-5"/>Watch on YouTube</a><a className="btn-secondary" href={brand.instagram} target="_blank" rel="noreferrer"><img src={brand.socialIcons.instagram} alt="Instagram" className="h-5 w-5"/>See Instagram</a></div></div><PortfolioFilters active={filter} onChange={setFilter}/></div><PortfolioGrid items={shown} onOpen={setActive}/></section>
    <YoutubeShowcase items={portfolioItems} onOpen={setActive}/>
    <InstagramShowcase items={portfolioItems} onOpen={setActive}/>
    <PortfolioCTA/>
    <PortfolioModal item={active} items={shown} onClose={()=>setActive(null)} onNavigate={navigate}/>
  </>
}
