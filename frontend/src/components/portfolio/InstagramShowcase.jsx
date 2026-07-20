import { brand } from '../../data/brandData'
import SmartImage from '../SmartImage'

export default function InstagramShowcase({ items, onOpen }) {
  const ig = items.filter((i) => i.source === 'Instagram')
  return (
    <section className="section-pad pt-0">
      <div className="container-premium">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Latest Frames from Instagram</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream sm:text-5xl">
              Recent visual moments.
            </h2>
          </div>
          <a className="btn-secondary" href={brand.instagram} target="_blank" rel="noreferrer">
            <img src={brand.socialIcons.instagram} alt="Instagram" className="h-5 w-5" />
            See more on Instagram
          </a>
        </div>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
          {ig.map((item) => (
            <button
              key={item.id}
              onClick={() => onOpen(item)}
              className="group relative min-w-[58vw] snap-start overflow-hidden rounded-[28px] border border-white/10 transition active:scale-[0.99] sm:min-w-[260px]"
            >
              <div className="aspect-[4/5]">
                <SmartImage src={item.thumbnail} alt={item.title} objectPosition={item.objectPosition} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
