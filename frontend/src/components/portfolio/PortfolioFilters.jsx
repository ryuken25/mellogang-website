import { motion } from 'framer-motion'
import { portfolioFilters } from '../../data/portfolioData'
export default function PortfolioFilters({ active, onChange }) {
  return <div className="sticky top-20 z-30 -mx-4 mb-10 overflow-x-auto border-y border-white/10 bg-ink/75 px-4 py-3 backdrop-blur-2xl sm:mx-0 sm:rounded-full sm:border sm:px-3">
    <div className="flex min-w-max gap-2">{portfolioFilters.map(filter => <button key={filter} onClick={() => onChange(filter)} className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${active===filter?'text-black':'text-cream/70 hover:text-cream'}`}>
      {active===filter && <motion.span layoutId="portfolioFilter" className="absolute inset-0 rounded-full bg-gold" transition={{type:'spring',stiffness:380,damping:32}}/>}
      <span className="relative z-10">{filter}</span>
    </button>)}</div>
  </div>
}
