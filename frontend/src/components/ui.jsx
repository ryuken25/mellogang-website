import { motion } from 'framer-motion'
import { cn, statusTone } from '../lib/utils'

export function SectionHeader({ eyebrow, title, children, center = false }) {
  return <div className={cn('mb-10 max-w-3xl', center && 'mx-auto text-center')}>
    <p className="eyebrow">{eyebrow}</p>
    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-cream sm:text-5xl">{title}</h2>
    {children && <p className="subtle mt-5">{children}</p>}
  </div>
}
export function Card({ className, children }) { return <div className={cn('glass rounded-[2rem] p-6', className)}>{children}</div> }
export function Badge({ children, className }) { return <span className={cn('badge', className)}>{children}</span> }
export function StatusBadge({ status }) { return <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize', statusTone(status))}>{String(status || 'unknown').replaceAll('_',' ')}</span> }
export function Reveal({ children, delay = 0, className }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: .75, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
export function EmptyState({ title='Belum ada data', text='Data akan tampil otomatis setelah backend terhubung.' }) {
  return <Card className="text-center"><p className="text-lg font-semibold text-cream">{title}</p><p className="subtle mt-2">{text}</p></Card>
}
