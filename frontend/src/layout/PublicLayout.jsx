import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { backendUrl } from '../lib/api'
import { cn } from '../lib/utils'
import { brand } from '../data/brandData'
const nav = [['/','Home'],['/katalog','Katalog'],['/portofolio','Portofolio'],['/kontak','Kontak'],['/status-pesanan','Status'],['/invoice','Invoice']]
export default function PublicLayout(){
 const [open,setOpen]=useState(false)
 return <div className="min-h-screen">
  <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl">
   <div className="container-premium flex h-20 items-center justify-between">
    <Link to="/" className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-gold/40 bg-[#202020] shadow-glow"><img src={brand.logo} alt="Mellogang Visuals logo" className="h-full w-full object-cover"/></span><span><b className="block text-lg tracking-tight">{brand.name}</b><small className="text-cream/45">{brand.tagline.replace('Mellogang Visuals | ', '')}</small></span></Link>
    <nav className="hidden items-center gap-1 lg:flex">{nav.map(([href,label])=><NavLink key={href} to={href} className={({isActive})=>cn('rounded-full px-4 py-2 text-sm text-cream/65 hover:bg-white/5 hover:text-cream',isActive&&'bg-white/10 text-cream')}>{label}</NavLink>)}</nav>
    <div className="hidden items-center gap-3 lg:flex"><a className="btn-secondary" href={backendUrl('/login')}>Login</a><Link className="btn-primary" to="/katalog"><Sparkles size={16}/>Booking</Link></div>
    <button className="lg:hidden" onClick={()=>setOpen(!open)}><Menu/></button>
   </div>
   {open && <div className="container-premium pb-5 lg:hidden">{nav.map(([href,label])=><NavLink onClick={()=>setOpen(false)} key={href} to={href} className="block rounded-2xl px-4 py-3 text-cream/80 hover:bg-white/5">{label}</NavLink>)}<a className="btn-primary mt-3 w-full" href={backendUrl('/login')}>Login Backend</a></div>}
  </header>
  <main><Outlet/></main>
  <footer className="border-t border-white/10 py-10"><div className="container-premium flex flex-col gap-4 text-sm text-cream/55 md:flex-row md:items-center md:justify-between"><p>© {new Date().getFullYear()} {brand.name}. {brand.tagline.replace('Mellogang Visuals | ', '')}.</p><div className="flex flex-wrap gap-3"><a className="hover:text-gold" href={brand.instagram} target="_blank">Instagram</a><a className="hover:text-gold" href={brand.youtube} target="_blank">YouTube</a><a className="hover:text-gold" href={brand.linkedin} target="_blank">LinkedIn</a><a className="hover:text-gold" href={brand.linktree} target="_blank">Linktree</a></div></div></footer>
 </div>
}
