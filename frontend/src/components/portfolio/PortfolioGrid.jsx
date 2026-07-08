import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '../ui'
import { brand } from '../../data/brandData'
import PortfolioCard from './PortfolioCard'
export default function PortfolioGrid({ items, onOpen }) {
  if (!items.length) return <div className="container-premium"><EmptyState title="No works found in this category yet." text={<span>See more on <a className="text-gold" href={brand.instagram} target="_blank" rel="noreferrer">Instagram</a> or <a className="text-gold" href={brand.youtube} target="_blank" rel="noreferrer">YouTube</a>.</span>} /></div>
  return <div className="container-premium"><motion.div layout className="grid auto-rows-[260px] gap-4 md:grid-cols-3 lg:grid-cols-4">
    <AnimatePresence>{items.map((item,index)=><motion.div key={item.id} layout initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:.95}} transition={{duration:.35}} className="contents"><PortfolioCard item={item} index={index} onOpen={onOpen}/></motion.div>)}</AnimatePresence>
  </motion.div></div>
}
