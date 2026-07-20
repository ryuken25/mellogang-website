import { motion } from 'framer-motion'
import { cn, statusTone } from '../lib/utils'
import { useMotionProfile } from '../hooks/useMotionProfile'

export function SectionHeader({ eyebrow, title, children, center = false }) {
  return (
    <div className={cn('mb-10 max-w-3xl', center && 'mx-auto text-center')}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-cream sm:text-5xl">{title}</h2>
      {children && <p className="subtle mt-5">{children}</p>}
    </div>
  )
}
export function Card({ className, children }) {
  return <div className={cn('glass rounded-[2rem] p-6', className)}>{children}</div>
}
export function Badge({ children, className }) {
  return <span className={cn('badge', className)}>{children}</span>
}
export function StatusBadge({ status }) {
  return (
    <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize', statusTone(status))}>
      {String(status || 'unknown').replaceAll('_', ' ')}
    </span>
  )
}
export function Reveal({ children, delay = 0, className }) {
  const profile = useMotionProfile()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: profile.revealY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: profile.lite ? '-6% 0px' : '-10% 0px', amount: profile.lite ? 0.2 : 0.25 }}
      transition={{ duration: profile.revealDuration, delay: profile.lite ? Math.min(delay, 0.12) : delay, ease: profile.ease }}
    >
      {children}
    </motion.div>
  )
}
export function EmptyState({ title = 'Belum ada data', text = 'Data akan tampil otomatis setelah backend terhubung.' }) {
  return (
    <Card className="text-center">
      <p className="text-lg font-semibold text-cream">{title}</p>
      <p className="subtle mt-2">{text}</p>
    </Card>
  )
}
