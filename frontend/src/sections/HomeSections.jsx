import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CalendarCheck, CheckCircle2, Clapperboard, Film, MessageCircle,
  PackageCheck, Upload, Wand2, Camera, Heart, GraduationCap, PartyPopper,
  Palette, ChevronLeft, ChevronRight, Star, Clock, Shield, Sparkles,
  HelpCircle, ChevronDown, X, Play
} from 'lucide-react'
import { Card, Reveal, SectionHeader } from '../components/ui'
import { services, packages } from '../data/mockData'
import { brand } from '../data/brandData'
import { featuredPortfolioItems, portfolioItems } from '../data/portfolioData'

/* ------------------------------------------------------------------ */
/*  Trust Stats                                                        */
/* ------------------------------------------------------------------ */
const trustStats = [
  { label: 'Projects Delivered', value: '200+', icon: CheckCircle2 },
  { label: 'Happy Clients', value: '150+', icon: Heart },
  { label: 'Years Experience', value: '4+', icon: Clock },
  { label: '5-Star Reviews', value: '98%', icon: Star },
]

/* ------------------------------------------------------------------ */
/*  Scroll Story Steps                                                 */
/* ------------------------------------------------------------------ */
const storySteps = [
  {
    id: 'wedding',
    title: 'Wedding Stories',
    subtitle: 'Cinematic coverage for your once-in-a-lifetime moment',
    description: 'From intimate traditional ceremonies to grand celebrations, we capture every emotion with cinematic precision. Your wedding story told through warm, editorial frames.',
    icon: Heart,
    color: 'from-rose to-peach',
    tagColor: 'tag-rose',
    image: '/brand/instagram/ig-01.jpg',
  },
  {
    id: 'ceremony',
    title: 'Ceremony Moments',
    subtitle: 'Sacred rituals and family traditions preserved forever',
    description: 'Balinese ceremonies, family gatherings, and spiritual moments captured with respect and cinematic beauty. Natural light, authentic emotion, timeless composition.',
    icon: Sparkles,
    color: 'from-gold to-amberglow',
    tagColor: 'tag-peach',
    image: '/brand/instagram/ig-02.jpg',
  },
  {
    id: 'graduation',
    title: 'Graduation Memories',
    subtitle: 'Milestone moments that deserve cinematic treatment',
    description: 'Your achievement, your journey, your celebration. Graduation documentation with warm candid shots, family portraits, and short vertical reels for social sharing.',
    icon: GraduationCap,
    color: 'from-aqua to-mint',
    tagColor: 'tag-mint',
    image: '/brand/instagram/ig-03.jpg',
  },
  {
    id: 'event',
    title: 'Event Coverage',
    subtitle: 'Dynamic multi-angle production for any occasion',
    description: 'Corporate events, product launches, and cultural celebrations. Multi-camera coverage with recap videos, candid details, and social media cutdowns ready to publish.',
    icon: PartyPopper,
    color: 'from-lilac to-rose',
    tagColor: 'tag-lilac',
    image: '/brand/instagram/ig-04.jpg',
  },
  {
    id: 'custom',
    title: 'Custom Creative',
    subtitle: 'Your vision, our cinematic expertise',
    description: 'Music visuals, brand campaigns, creative concepts, and editorial productions. Tell us your vision and we will bring it to life with premium photo-video production.',
    icon: Palette,
    color: 'from-mint to-aqua',
    tagColor: 'tag-mint',
    image: '/brand/instagram/ig-05.jpg',
  },
]

/* ------------------------------------------------------------------ */
/*  FAQ Data                                                           */
/* ------------------------------------------------------------------ */
const faqItems = [
  { q: 'Berapa lama proses editing?', a: 'Tergantung paket: 5-14 hari kerja untuk foto, 14-21 hari untuk cinematic film. Progress bisa di-track via dashboard.' },
  { q: 'Apakah bisa custom paket?', a: 'Bisa! Konsultasi via WhatsApp untuk custom paket, lokasi, durasi, dan deliverable sesuai kebutuhan.' },
  { q: 'Bagaimana sistem pembayaran?', a: 'DP 50% saat booking, pelunasan setelah editing selesai. Transfer bank atau QRIS.' },
  { q: 'Apakah tersedia di luar Bali?', a: 'Ya, tersedia untuk lokasi di seluruh Indonesia. Biaya transport dan akomodasi ditambahkan.' },
  { q: 'Berapa jumlah foto yang didapat?', a: 'Tergantung paket: 50-200+ edited photos. Semua dalam resolusi tinggi siap cetak dan social media.' },
]

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export function Hero() {
  const hero = featuredPortfolioItems.slice(0, 3)
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
      <div className="container-premium grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
        <Reveal>
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-gold/25 bg-gold/10 px-4 py-2">
            <img src={brand.logo} alt="Mellogang logo" className="h-7 w-7 rounded-full object-cover" />
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">{brand.handle} · {brand.location}</span>
          </div>
          <p className="eyebrow">Cinematic Visual Studio</p>
          <h1 className="headline mt-5">{brand.tagline}</h1>
          <p className="subtle mt-6 max-w-2xl text-lg">{brand.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to="/katalog">Lihat Paket <ArrowRight size={17} /></Link>
            <Link className="btn-secondary" to="/portofolio">Lihat Portfolio</Link>
          </div>
          <div className="mt-9 grid grid-cols-3 gap-3 max-w-lg">
            {[{ t: 'Wedding', s: 'Story' }, { t: 'Ceremony', s: 'Moment' }, { t: 'Bali', s: 'Production' }].map(x => (
              <Card key={x.t} className="rounded-3xl p-4">
                <b className="text-xl text-cream">{x.t}</b>
                <p className="text-xs text-cream/45">{x.s}</p>
              </Card>
            ))}
          </div>
        </Reveal>
        <div className="relative min-h-[420px] hidden lg:block">
          {hero.map((item, i) => (
            <motion.div
              key={item.id}
              className={`absolute overflow-hidden rounded-[2rem] border border-white/15 shadow-glow ${['left-8 top-6 h-64 w-52', 'right-0 top-28 h-72 w-56', 'bottom-4 left-20 h-56 w-72'][i]}`}
              animate={{ y: [0, i % 2 ? 14 : -12, 0] }}
              transition={{ duration: 7 + i, repeat: Infinity }}
            >
              <img className="h-full w-full object-cover" src={item.thumbnail} alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </motion.div>
          ))}
          <div className="absolute inset-10 -z-10 rounded-full bg-gold/15 blur-3xl" />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Trust Stats                                                        */
/* ------------------------------------------------------------------ */
export function TrustStats() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container-premium">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trustStats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.06}>
              <Card className="text-center rounded-2xl p-5">
                <stat.icon className="mx-auto text-gold" size={24} />
                <p className="mt-3 text-3xl font-bold text-cream">{stat.value}</p>
                <p className="mt-1 text-xs text-cream/50">{stat.label}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Selected Visual Stories                                            */
/* ------------------------------------------------------------------ */
export function SelectedVisualStories() {
  const [modalItem, setModalItem] = useState(null)
  const items = portfolioItems.slice(0, 6)

  function navigateModal(dir) {
    if (!modalItem) return
    const idx = items.findIndex(p => p.id === modalItem.id)
    const next = (idx + dir + items.length) % items.length
    setModalItem(items[next])
  }

  return (
    <section className="section-pad">
      <div className="container-premium">
        <SectionHeader eyebrow="Portfolio" title="Selected Visual Stories">
          Real frames from weddings, ceremonies, graduations, and creative productions across Bali.
        </SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <Reveal delay={i * 0.04} key={p.id}>
              <button
                onClick={() => setModalItem(p)}
                className={`group block w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 text-left transition hover:border-gold/30 ${i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                    src={p.thumbnail}
                    alt={p.title}
                    style={{ objectPosition: p.objectPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="badge text-[10px]">{p.source} · {p.category}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-cream">{p.title}</h3>
                  <p className="subtle mt-1 line-clamp-2 text-sm">{p.description}</p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link className="btn-primary" to="/portofolio">View All Portfolio <ArrowRight size={17} /></Link>
        </div>
      </div>

      {/* Portfolio Modal */}
      <AnimatePresence>
        {modalItem && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/82 p-3 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalItem(null)}
          >
            <motion.div
              className="safe-modal relative w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-charcoal shadow-2xl sm:rounded-[2rem]"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute right-4 top-4 z-10 rounded-full bg-black/65 p-3 text-white backdrop-blur-xl hover:bg-black/80"
                onClick={() => setModalItem(null)}
              >
                <X size={18} />
              </button>
              <div className="grid max-h-[92svh] min-h-0 lg:grid-cols-[1.25fr_.75fr]">
                <div className="min-h-[220px] bg-black sm:min-h-[300px]">
                  {modalItem.type === 'youtube' && modalItem.embedUrl ? (
                    <iframe
                      className="aspect-video h-full min-h-[300px] w-full"
                      src={modalItem.embedUrl}
                      title={modalItem.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <img
                      className="h-full max-h-[42svh] w-full object-cover lg:max-h-[80vh]"
                      src={modalItem.thumbnail}
                      alt={modalItem.title}
                      style={{ objectPosition: modalItem.objectPosition }}
                    />
                  )}
                </div>
                <div className="min-h-0 overflow-y-auto p-5 sm:p-8 lg:max-h-[80vh]">
                  <p className="eyebrow">{modalItem.source} · {modalItem.category}</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-.04em] text-cream sm:text-3xl">{modalItem.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-cream/68">{modalItem.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {modalItem.tags?.map(t => <span key={t} className="badge">{t}</span>)}
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <a className="btn-primary" href={modalItem.url} target="_blank" rel="noreferrer">
                      {modalItem.source === 'YouTube' ? 'Watch on YouTube' : 'View on Instagram'} <ArrowRight size={16} />
                    </a>
                    <a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer">
                      <MessageCircle size={16} /> Book Similar Concept
                    </a>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="btn-secondary" onClick={() => navigateModal(-1)}>
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <button className="btn-secondary" onClick={() => navigateModal(1)}>
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Stories & Packages Scroll Story                                    */
/* ------------------------------------------------------------------ */
export function StoriesAndPackages() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const rect = entry.boundingClientRect
            const viewportHeight = window.innerHeight
            const scrollProgress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height)))
            const stepIndex = Math.min(storySteps.length - 1, Math.floor(scrollProgress * storySteps.length))
            setActiveStep(stepIndex)
          }
        })
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 19) }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const current = storySteps[activeStep]

  return (
    <section ref={sectionRef} className="section-pad relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,200,117,.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(184,243,230,.06),transparent_40%)]" />
      <div className="container-premium relative">
        <SectionHeader center eyebrow="Stories & Packages" title="Visual production untuk setiap momen" />

        {/* Step indicators */}
        <div className="mx-auto mb-10 flex max-w-2xl items-center gap-2">
          {storySteps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(i)}
              className={`flex-1 rounded-full py-2 text-center text-xs font-bold transition-all ${
                i === activeStep
                  ? 'bg-gold text-ink'
                  : i < activeStep
                    ? 'bg-gold/20 text-gold'
                    : 'bg-white/5 text-cream/40'
              }`}
            >
              {step.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Story content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="relative overflow-hidden rounded-[2rem] border border-white/10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <img
                className="h-72 w-full object-cover sm:h-96 lg:h-[480px]"
                src={current.image}
                alt={current.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className={current.tagColor}>{current.title}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right: text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className="flex flex-col justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${current.color}`}>
                <current.icon className="text-white" size={24} />
              </div>
              <h3 className="mt-6 text-3xl font-bold text-cream sm:text-4xl">{current.title}</h3>
              <p className="mt-2 text-lg text-gold">{current.subtitle}</p>
              <p className="mt-4 text-sm leading-7 text-cream/65">{current.description}</p>
              <div className="mt-8 flex gap-3">
                <Link className="btn-primary" to="/katalog">View Packages <ArrowRight size={16} /></Link>
                <a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} /> Consult
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Packages Preview                                                   */
/* ------------------------------------------------------------------ */
export function PackagesPreview() {
  return (
    <section className="section-pad">
      <div className="container-premium">
        <SectionHeader eyebrow="Packages" title="Paket visual production">
          Paket lengkap dengan direction, schedule, payment flow, dan tracking progress.
        </SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.slice(0, 6).map((pkg, i) => (
            <Reveal delay={i * 0.04} key={pkg.id_paket}>
              <Card className="group flex h-full flex-col rounded-[2rem] p-6 transition hover:border-gold/30">
                <span className="badge w-fit">{pkg.kategori}</span>
                <h3 className="mt-4 text-xl font-semibold text-cream">{pkg.nama_paket}</h3>
                <p className="subtle mt-2 flex-1 text-sm">{pkg.deskripsi}</p>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-gold">Rp {(pkg.harga / 1000000).toFixed(1)}jt</p>
                  <p className="text-xs text-cream/45">{pkg.durasi_jam} jam coverage</p>
                </div>
                <ul className="mt-4 space-y-2">
                  {pkg.deliverables.map(d => (
                    <li key={d} className="flex items-start gap-2 text-sm text-cream/65">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-aqua" />
                      {d}
                    </li>
                  ))}
                </ul>
                <Link className="btn-primary mt-6 w-full" to="/katalog">
                  Booking <ArrowRight size={16} />
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Films & Motion Stories                                             */
/* ------------------------------------------------------------------ */
export function FilmsAndMotion() {
  const films = portfolioItems.filter(p => p.type === 'youtube').slice(0, 3)
  return (
    <section className="section-pad">
      <div className="container-premium">
        <SectionHeader eyebrow="Films" title="Films & Motion Stories">
          Cinematic wedding films, prewedding stories, dan visual production dari channel YouTube Mellogang.
        </SectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {films.map((film, i) => (
            <Reveal delay={i * 0.06} key={film.id}>
              <a
                href={film.url}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition hover:border-gold/30"
              >
                <div className="relative overflow-hidden">
                  <img
                    className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
                    src={film.thumbnail}
                    alt={film.title}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/90">
                      <Play className="ml-1 text-ink" size={22} />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <span className="badge text-[10px]">{film.category}</span>
                  <h3 className="mt-3 text-lg font-semibold text-cream">{film.title}</h3>
                  <p className="subtle mt-1 line-clamp-2 text-sm">{film.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a className="btn-secondary" href={brand.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  How Booking Works                                                  */
/* ------------------------------------------------------------------ */
const bookingSteps = [
  ['Pilih Paket', PackageCheck, 'Pilih paket yang sesuai kebutuhan acara lo.'],
  ['Konsultasi', MessageCircle, 'Diskusi via WhatsApp: tanggal, lokasi, konsep visual.'],
  ['Booking', CalendarCheck, 'Konfirmasi booking dengan DP 50%.'],
  ['Produksi', Clapperboard, 'Shooting day dengan full direction dan tim profesional.'],
  ['Editing', Wand2, 'Color grading, editing cinematic, dan revisi.'],
  ['Selesai', CheckCircle2, 'File dikirim via cloud delivery gallery.'],
]

export function HowBookingWorks() {
  return (
    <section className="section-pad">
      <div className="container-premium">
        <SectionHeader center eyebrow="Workflow" title="Booking sampai selesai, semua ter-track" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookingSteps.map(([label, Icon, desc], i) => (
            <Reveal delay={i * 0.04} key={label}>
              <Card className="h-full rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15">
                    <Icon className="text-gold" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gold">Step {i + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-cream">{label}</h3>
                    <p className="subtle mt-1 text-sm">{desc}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                */
/* ------------------------------------------------------------------ */
export function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  return (
    <section className="section-pad">
      <div className="container-premium max-w-3xl">
        <SectionHeader center eyebrow="FAQ" title="Pertanyaan yang sering ditanyakan" />
        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <Card className="rounded-2xl overflow-hidden">
                <button
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                >
                  <span className="font-semibold text-cream">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-cream/45 transition-transform ${openIdx === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openIdx === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="subtle px-5 pb-5">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  CTA                                                                */
/* ------------------------------------------------------------------ */
export function ContactCTA() {
  return (
    <section className="pb-20">
      <div className="container-premium">
        <Card className="overflow-hidden rounded-[2.5rem] p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow">Ready when you are</p>
              <h2 className="mt-4 text-3xl font-semibold sm:text-5xl text-cream">
                Bikin visual lo kerasa cinematic dari first impression.
              </h2>
              <p className="subtle mt-4 max-w-xl">
                Konsultasi gratis via WhatsApp. Ceritain konsep, tanggal, dan lokasi acara lo — kita bantu susun visual production-nya.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <a className="btn-primary" href={brand.whatsapp} target="_blank" rel="noreferrer">
                <MessageCircle size={17} /> Booking via WhatsApp
              </a>
              <Link className="btn-secondary" to="/kontak">
                Lihat Kontak <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
