import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, ExternalLink, X } from 'lucide-react'
import { brand } from '../../data/brandData'
import SmartImage from '../SmartImage'

export default function PortfolioModal({ item, onClose, onNavigate }) {
  useEffect(() => {
    if (!item) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate(1)
      if (e.key === 'ArrowLeft') onNavigate(-1)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.classList.add('modal-open')
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.documentElement.classList.remove('modal-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose, onNavigate])

  if (!item) return null
  const isYoutube = item.type === 'youtube' && item.embedUrl

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-4 light:bg-black/45"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <div
        className="safe-modal relative flex max-h-[min(94dvh,940px)] w-full max-w-6xl flex-col overflow-hidden rounded-t-[1.5rem] border border-white/10 bg-[#0d1110] text-cream shadow-2xl sm:rounded-[2rem] light:border-black/10 light:bg-[#fffaf3] light:text-charcoal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/55 text-white backdrop-blur-xl light:border-black/10 light:bg-white/90 light:text-charcoal"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1.25fr_.75fr]">
          <div className="min-h-[220px] bg-black sm:min-h-[300px]">
            {isYoutube ? (
              <iframe
                className="aspect-video h-full min-h-[220px] w-full sm:min-h-[300px]"
                src={item.embedUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="h-full max-h-[42dvh] lg:max-h-none">
                <SmartImage src={item.thumbnail} alt={item.title} objectPosition={item.objectPosition} />
              </div>
            )}
          </div>

          <div className="min-h-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-8">
            <p className="eyebrow">
              {item.source} · {item.category}
            </p>
            <h3 className="mt-3 pr-12 text-2xl font-semibold tracking-[-.04em] text-cream light:text-charcoal sm:mt-4 sm:text-4xl">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-7 text-cream/70 light:text-black/65">{item.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags?.map((t) => (
                <span key={t} className="badge">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a className="btn-primary" href={item.url} target="_blank" rel="noreferrer">
                <img
                  src={brand.socialIcons[item.source === 'YouTube' ? 'youtube' : 'instagram']}
                  alt={item.source}
                  className="h-5 w-5"
                />
                {item.source === 'YouTube' ? 'Watch on YouTube' : 'View on Instagram'}
                <ExternalLink size={16} />
              </a>
              <a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer">
                <img src={brand.socialIcons.whatsapp} alt="WhatsApp" className="h-5 w-5" />
                Book Similar Concept
              </a>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button type="button" className="btn-secondary" onClick={() => onNavigate(-1)}>
                <ArrowLeft size={16} /> Prev
              </button>
              <button type="button" className="btn-secondary" onClick={() => onNavigate(1)}>
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
