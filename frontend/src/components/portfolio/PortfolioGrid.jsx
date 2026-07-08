import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '../ui'
import { brand } from '../../data/brandData'
import PortfolioCard from './PortfolioCard'
export default function PortfolioGrid({ items, onOpen }) {
  if (!items.length) return <div className="container-premium"><EmptyState title="No works found in this category yet." text={<span>See more on <a className="text-gold" href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a> or <a className="text-gold" href={brand.youtube} target="_blank" rel="noreferrer">YouTube</a>.</span>} /></div>
  return <div className="container-premium"><motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"><AnimatePresence>{items.map(item=><motion.div key={item.id} layout initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.98}} transition={{duration:.3}}><PortfolioCard item={item} onOpen={onOpen}/></motion.div>)}</AnimatePresence></motion.div></div>
}
