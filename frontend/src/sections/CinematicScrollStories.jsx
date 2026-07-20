import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { landingStoryChapters } from '../data/portfolioData'
import { brand } from '../data/brandData'
import { cn } from '../lib/utils'

function Chapter({ chapter, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.45, margin: '-10% 0px -10% 0px' })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [48, -48])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1, 1.04])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.25, 1, 1, 0.35])
  const smoothY = useSpring(y, { stiffness: 70, damping: 22 })

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden border-b border-white/5"
    >
      <motion.div style={{ y: smoothY, scale, opacity }} className="absolute inset-0">
        <img
          src={chapter.image}
          alt={chapter.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
      </motion.div>

      <div className="container-premium relative z-10 flex min-h-[100svh] items-end py-20 sm:items-center sm:py-24">
        <motion.div
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.35, y: 28 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold">
            {chapter.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-cream sm:text-6xl">
            {chapter.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-cream/75 sm:text-lg">
            {chapter.text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to={chapter.cta.to}>
              {chapter.cta.label} <ArrowRight size={16} />
            </Link>
            <a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer">
              Consult Concept
            </a>
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.28em] text-cream/35">
            {String(index + 1).padStart(2, '0')} / {String(landingStoryChapters.length).padStart(2, '0')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Full-page cinematic scroll story (non-GSAP).
 * Elegant parallax + chapter fades inspired by premium film studio sites.
 */
export default function CinematicScrollStories() {
  const chapters = useMemo(() => landingStoryChapters, [])
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)

  useEffect(() => {
    const nodes = Array.from(rootRef.current?.querySelectorAll('[data-chapter]') || [])
    if (!nodes.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        const idx = Number(visible.target.getAttribute('data-chapter') || 0)
        setActive(idx)
      },
      { threshold: [0.35, 0.55, 0.7] }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="relative bg-ink">
      {/* sticky progress rail */}
      <div className="pointer-events-none fixed bottom-8 left-1/2 z-40 hidden -translate-x-1/2 lg:block">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-xl">
          {chapters.map((c, i) => (
            <span
              key={c.id}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                i === active ? 'w-8 bg-gold' : 'w-2 bg-white/25'
              )}
            />
          ))}
        </div>
      </div>

      {chapters.map((chapter, index) => (
        <div key={chapter.id} data-chapter={index}>
          <Chapter chapter={chapter} index={index} />
        </div>
      ))}

      {/* closing strip */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <img src="/brand/portfolio/yt-8kSnL2fBCTU.jpg" alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50" />
        </div>
        <div className="container-premium relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">Film Experience</p>
            <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-cream sm:text-5xl">
              A selling website feels like a premiere.
            </h3>
            <p className="subtle mt-4 max-w-xl">
              Smooth storytelling, premium media, effortless booking — designed to feel like a $5,000 brand experience.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <Link className="btn-primary" to="/portofolio">
              <Play size={16} /> Enter Portfolio
            </Link>
            <Link className="btn-secondary" to="/katalog">
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
