import { useMotionProfile } from '../../hooks/useMotionProfile'
import { motion, AnimatePresence } from 'framer-motion'
import { EmptyState } from '../ui'
import { brand } from '../../data/brandData'
import PortfolioCard from './PortfolioCard'

export default function PortfolioGrid({ items, onOpen }) {
  const profile = useMotionProfile()
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
      <motion.div layout={!profile.lite} className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode={profile.lite ? 'sync' : 'popLayout'}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              layout={!profile.lite}
              initial={{ opacity: 0, y: profile.lite ? 10 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: profile.lite ? 1 : 0.98 }}
              transition={{ duration: profile.lite ? 0.28 : 0.35, delay: Math.min(index * (profile.lite ? 0.02 : 0.03), profile.lite ? 0.12 : 0.24) }}
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
