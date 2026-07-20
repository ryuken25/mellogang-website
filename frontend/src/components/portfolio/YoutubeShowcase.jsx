import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { brand } from '../../data/brandData'
import SmartImage from '../SmartImage'

export default function YoutubeShowcase({ items, onOpen }) {
  const yt = items.filter((i) => i.source === 'YouTube').slice(0, 8)
  const ref = useRef(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = () => {
    const el = ref.current
    if (!el) return
    setAtStart(el.scrollLeft < 10)
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10)
  }

  const scroll = (dir) => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector('[data-film-card]')
    el.scrollBy({ left: dir * ((card?.clientWidth || 420) + 20), behavior: 'smooth' })
    setTimeout(update, 320)
  }

  return (
    <section className="section-pad">
      <div className="container-premium">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Films & Motion Stories</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream light:text-charcoal sm:text-5xl">
              Watch the stories in motion.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Scroll films left"
              disabled={atStart}
              onClick={() => scroll(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream transition hover:border-gold/50 hover:text-gold disabled:opacity-35 light:border-black/10 light:bg-black/5 light:text-charcoal"
            >
              <ChevronLeft />
            </button>
            <button
              aria-label="Scroll films right"
              disabled={atEnd}
              onClick={() => scroll(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-cream transition hover:border-gold/50 hover:text-gold disabled:opacity-35 light:border-black/10 light:bg-black/5 light:text-charcoal"
            >
              <ChevronRight />
            </button>
            <a className="btn-secondary" href={brand.youtube} target="_blank" rel="noreferrer">
              <img src={brand.socialIcons.youtube} alt="YouTube" className="h-5 w-5" />
              Watch on YouTube
            </a>
          </div>
        </div>

        <div
          ref={ref}
          onScroll={update}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4"
        >
          {yt.map((item) => (
            <button
              data-film-card
              key={item.id}
              onClick={() => onOpen(item)}
              className="group min-w-[82vw] snap-start overflow-hidden rounded-[28px] border border-white/10 bg-white/[.045] text-left transition active:scale-[0.99] md:min-w-[420px] md:hover:scale-[1.015] lg:min-w-[460px] light:border-black/10 light:bg-black/[.035]"
            >
              <div className="relative aspect-video overflow-hidden">
                <SmartImage src={item.thumbnail} alt={item.title} objectPosition={item.objectPosition} />
                <div className="absolute inset-0 grid place-items-center bg-black/15">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-black">
                    <Play fill="currentColor" />
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="badge">
                  <img src={brand.socialIcons.youtube} alt="YouTube" className="h-4 w-4" /> YouTube
                </p>
                <h3 className="mt-3 text-xl font-semibold text-cream light:text-charcoal">{item.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-cream/55 light:text-black/55">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
