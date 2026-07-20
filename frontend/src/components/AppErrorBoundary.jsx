import { Link, useRouteError } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { brand } from '../data/brandData'
export default function AppErrorBoundary(){
  const error = useRouteError()
  console.error(error)
  return <section className="min-h-screen bg-page grid place-items-center p-6"><div className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[.055] p-8 text-center shadow-soft"><img src={brand.logo} alt="Mellogang Visuals" className="mx-auto h-16 w-16 object-contain"/><p className="eyebrow mt-6">Mellogang Visuals</p><h1 className="mt-4 text-4xl font-semibold tracking-[-.04em] text-cream light:text-charcoal">Something went wrong, but your story is still safe.</h1><p className="subtle mt-4">The page hit an unexpected issue. You can go back home or contact Mellogang directly.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link className="btn-primary" to="/">Back to Home</Link><a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/>Contact WhatsApp</a></div></div></section>
}
