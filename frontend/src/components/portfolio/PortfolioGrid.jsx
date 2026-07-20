import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '../ui'
import { brand } from '../../data/brandData'
import PortfolioCard from './PortfolioCard'

export default function PortfolioGrid({ items, onOpen }) {
  if (!items.length) {
    return (
      <div className="container-premium">
        <EmptyState
          title="No works found in this category yet."
          text={
            <span>
              See more on{' '}
              <a className="text-gold" href={brand.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>{' '}
              or{' '}
              <a className="text-gold" href={brand.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
              .
            </span>
          }
        />
      </div>
    )
  }

  return (
    <div className="container-premium">
      <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.24) }}
              className={index % 5 === 0 ? 'md:col-span-2 xl:col-span-1' : ''}
            >
              <PortfolioCard item={item} onOpen={onOpen} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
