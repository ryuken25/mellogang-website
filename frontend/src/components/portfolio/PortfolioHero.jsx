import { motion } from 'framer-motion'
import { ArrowRight, AtSign, Film, Play } from 'lucide-react'
import { brand } from '../../data/brandData'

const collage = ['/brand/instagram/ig-01.jpg','/brand/instagram/ig-02.jpg','/brand/instagram/ig-03.jpg','/brand/instagram/ig-04.jpg','/brand/instagram/ig-05.jpg','/brand/instagram/ig-06.jpg']
const tags = ['Instagram', 'YouTube', 'Wedding', 'Graduation', 'Ceremony']
export default function PortfolioHero({ onExplore }) {
  return <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_25%_10%,rgba(0,240,192,.18),transparent_30%),radial-gradient(circle_at_78%_25%,rgba(245,239,228,.10),transparent_28%)]" />
    <div className="absolute inset-0 -z-10 opacity-[.08] bg-[linear-gradient(90deg,white_1px,transparent_1px),linear-gradient(white_1px,transparent_1px)] bg-[size:80px_80px]" />
    <div className="container-premium grid items-center gap-12 lg:grid-cols-[1fr_.92fr]">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:.75}}>
        <p className="eyebrow">Portfolio Showcase</p>
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-[-0.055em] text-cream sm:text-6xl lg:text-8xl">Visual Stories, Crafted Like Cinema.</h1>
        <p className="subtle mt-6 max-w-2xl text-lg">From wedding rituals and graduation moments to creative films and event stories, Mellogang Visuals captures real emotions with a cinematic eye.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button className="btn-primary" onClick={onExplore}>Explore Works <ArrowRight size={17}/></button>
          <a className="btn-secondary" href={brand.youtube} target="_blank" rel="noreferrer"><Play size={17}/>Watch on YouTube</a>
          <a className="btn-secondary" href={brand.instagram} target="_blank" rel="noreferrer"><AtSign size={17}/>See Instagram</a>
        </div>
        <div className="mt-8 flex flex-wrap gap-2">{tags.map(t=><span key={t} className="badge border-gold/20 bg-gold/10 text-gold">{t}</span>)}</div>
      </motion.div>
      <div className="relative min-h-[560px]">
        {collage.map((src,i)=><motion.div key={src} className={`absolute overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl ${[
          'left-0 top-8 h-72 w-52 rotate-[-5deg]','left-44 top-0 h-52 w-72 rotate-[3deg]','right-0 top-32 h-72 w-56 rotate-[5deg]','left-20 bottom-8 h-64 w-80 rotate-[-2deg]','right-24 bottom-0 h-48 w-64 rotate-[4deg]','left-72 top-56 h-44 w-44 rotate-[-6deg]'
        ][i]}`} initial={{opacity:0,scale:.92,y:30}} animate={{opacity:1,scale:1,y:[0,i%2?10:-10,0]}} transition={{opacity:{delay:i*.08},scale:{delay:i*.08},y:{duration:7+i,repeat:Infinity,ease:'easeInOut'}}}>
          <img src={src} alt="Mellogang Instagram frame" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </motion.div>)}
        <div className="absolute right-8 top-4 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-sm text-cream/75 backdrop-blur-xl"><Film className="mr-2 inline text-gold" size={16}/>Real Mellogang Frames</div>
      </div>
    </div>
  </section>
}
