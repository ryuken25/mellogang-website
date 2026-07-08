import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { brand } from '../../data/brandData'
import SmartImage from '../SmartImage'
const hero = [
  { src:'/brand/instagram/ig-01.jpg', alt:'Wedding portrait', className:'left-0 top-4 w-[58%] aspect-[4/5]', pos:'50% 28%' },
  { src:'/brand/instagram/ig-02.jpg', alt:'Ceremony in Bali', className:'right-0 top-24 w-[52%] aspect-[16/10]', pos:'50% 45%' },
  { src:'/brand/instagram/ig-03.jpg', alt:'Graduation moment', className:'right-10 bottom-0 w-[38%] aspect-[4/5]', pos:'50% 35%' },
]
function IconImg({name}){return <img src={brand.socialIcons[name]} alt={name} className="h-5 w-5 object-contain"/>}
export default function PortfolioHero({ onExplore }) {
  return <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28"><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(0,240,192,.14),transparent_30%),radial-gradient(circle_at_78%_25%,rgba(245,239,228,.08),transparent_28%)]" />
    <div className="container-premium grid items-center gap-12 lg:grid-cols-[1fr_.92fr]"><motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.75}}><p className="eyebrow">Portfolio</p><h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.055em] text-cream sm:text-6xl lg:text-8xl">Cinematic Stories, Crafted in Bali.</h1><p className="subtle mt-6 max-w-2xl text-lg">Wedding rituals, graduation moments, ceremonies, events, and creative films captured with emotion, rhythm, and cinematic detail.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button className="btn-primary" onClick={onExplore}>Explore Works <ArrowRight size={17}/></button><a className="btn-secondary" href={brand.youtube} target="_blank" rel="noreferrer"><IconImg name="youtube"/>Watch on YouTube</a><a className="btn-secondary" href={brand.instagram} target="_blank" rel="noreferrer"><IconImg name="instagram"/>See Instagram</a></div></motion.div>
      <div className="relative min-h-[560px]">{hero.map((img,i)=><motion.div key={img.src} className={`absolute overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl ${img.className}`} initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:i*.12,duration:.6}}><SmartImage src={img.src} alt={img.alt} objectPosition={img.pos}/></motion.div>)}</div>
    </div></section>
}
