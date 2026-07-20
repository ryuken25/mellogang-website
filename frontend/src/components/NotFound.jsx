import { Link } from 'react-router-dom'
import { brand } from '../data/brandData'
import { Card } from './ui'

export default function NotFound() {
  return <section className="section-pad"><div className="container-premium max-w-3xl"><Card className="text-center"><img src={brand.logo} alt="Mellogang Visuals" className="mx-auto h-16 w-16 rounded-3xl object-cover"/><p className="eyebrow mt-6">404</p><h1 className="mt-4 text-4xl font-semibold text-cream">Page not found, but the story continues.</h1><p className="subtle mx-auto mt-4 max-w-xl">Route ini belum tersedia atau link-nya sudah berubah. Balik ke showcase utama atau hubungi Mellogang langsung.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/" className="btn-primary">Back to Home</Link><a href={brand.whatsapp} target="_blank" rel="noreferrer" className="btn-secondary">Contact WhatsApp</a></div></Card></div></section>
}
