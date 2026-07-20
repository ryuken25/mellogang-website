import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { landingStoryChapters } from '../data/portfolioData'
import { brand } from '../data/brandData'
import { cn } from '../lib/utils'
import { useMotionProfile } from '../hooks/useMotionProfile'

function Chapter({ chapter, index, lite }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4, margin: '-8% 0px -8% 0px' })

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] overflow-hidden border-b border-white/5"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 100svh' }}
    >
      <div className="absolute inset-0 will-change-transform">
        <img
          src={chapter.image}
          alt={chapter.title}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'h-full w-full object-cover transition-transform duration-700 ease-out',
            inView && !lite ? 'scale-100' : 'scale-[1.03]'
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />
      </div>

      <div className="container-premium relative z-10 flex min-h-[100dvh] items-end py-16 sm:items-center sm:py-24">
        <motion.div
          initial={false}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: lite ? 12 : 24 }}
          transition={{ duration: lite ? 0.4 : 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold">{chapter.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[-0.04em] text-cream sm:text-6xl">
            {chapter.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-cream/75 sm:text-lg">{chapter.text}</p>
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
 * Full-page cinematic scroll story optimized for Android/mobile.
 * Uses IntersectionObserver + lightweight transforms (no continuous parallax springs).
 */
export default function CinematicScrollStories() {
  const chapters = useMemo(() => landingStoryChapters, [])
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const profile = useMotionProfile()

  useEffect(() => {
    const nodes = Array.from(rootRef.current?.querySelectorAll('[data-chapter]') || [])
    if (!nodes.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        setActive(Number(visible.target.getAttribute('data-chapter') || 0))
      },
      { threshold: profile.lite ? [0.4, 0.6] : [0.35, 0.55, 0.7] }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [profile.lite])

  return (
    <div ref={rootRef} className="relative bg-ink">
      {/* mobile progress chips */}
      <div className="sticky top-16 sm:top-[4.6rem] z-30 border-b border-white/5 bg-ink/70 px-4 py-2 backdrop-blur-md light:border-black/10 light:bg-[#fff7ea]/90 lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto no-scrollbar">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                const el = rootRef.current?.querySelector(`[data-chapter="${i}"]`)
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold tracking-wide transition',
                i === active ? 'bg-gold text-ink' : 'bg-white/8 text-cream/60 light:bg-black/5 light:text-black/60'
              )}
            >
              {c.eyebrow.replace('Chapter ', 'Ch ')}
            </button>
          ))}
        </div>
      </div>

      {/* desktop progress rail */}
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
          <Chapter chapter={chapter} index={index} lite={profile.lite} />
        </div>
      ))}

      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0">
          <img
            src="/brand/portfolio/yt-8kSnL2fBCTU.jpg"
            alt=""
            className="h-full w-full object-cover opacity-35"
            loading="lazy"
            decoding="async"
          />
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
