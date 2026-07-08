import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { brand } from '../data/brandData'
const nav = [['/','Home'],['/katalog','Katalog'],['/portofolio','Portofolio'],['/status-pesanan','Status Pesanan'],['/kontak','Kontak']]
function SocialIcon({name,url}){return <a className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10" href={url} target="_blank" rel="noreferrer"><img src={brand.socialIcons[name]} alt={name} className="h-5 w-5 object-contain"/></a>}
export default function PublicLayout(){
 const [open,setOpen]=useState(false)
 return <div className="min-h-screen">
  <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl">
   <div className="container-premium flex h-20 items-center justify-between">
    <Link to="/" className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-gold/40 bg-[#202020] shadow-glow"><img src={brand.logo} alt="Mellogang Visuals logo" className="h-full w-full object-cover"/></span><span><b className="block text-lg tracking-tight">{brand.name}</b><small className="text-cream/45">{brand.location}</small></span></Link>
    <nav className="hidden items-center gap-1 lg:flex">{nav.map(([href,label])=><NavLink key={href} to={href} className={({isActive})=>cn('rounded-full px-4 py-2 text-sm text-cream/65 hover:bg-white/5 hover:text-cream',isActive&&'bg-white/10 text-cream',href==='/portofolio'&&'border border-gold/20')}>{label}</NavLink>)}</nav>
    <div className="hidden items-center gap-2 lg:flex"><SocialIcon name="instagram" url={brand.instagram}/><SocialIcon name="youtube" url={brand.youtube}/><Link className="btn-secondary" to="/auth?mode=signin">Login</Link><a className="btn-primary" href={brand.whatsapp} target="_blank" rel="noreferrer"><Sparkles size={16}/>Booking</a></div>
    <button className="lg:hidden" onClick={()=>setOpen(!open)}><Menu/></button>
   </div>
   {open && <div className="container-premium pb-5 lg:hidden">{nav.map(([href,label])=><NavLink onClick={()=>setOpen(false)} key={href} to={href} className="block rounded-2xl px-4 py-3 text-cream/80 hover:bg-white/5">{label}</NavLink>)}<Link className="btn-secondary mt-3 w-full" to="/auth?mode=signin">Login</Link><a className="btn-primary mt-3 w-full" href={brand.whatsapp} target="_blank" rel="noreferrer">Booking WhatsApp</a></div>}
  </header>
  <main><Outlet/></main>
  <footer className="border-t border-white/10 py-12"><div className="container-premium grid gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]"><div><div className="flex items-center gap-3"><img src={brand.logo} className="h-12 w-12 rounded-2xl object-cover"/><div><b className="text-cream">{brand.name}</b><p className="text-sm text-cream/45">{brand.tagline}</p></div></div><p className="subtle mt-5 max-w-md">{brand.description}</p><p className="mt-6 text-sm text-cream/45">© 2026 {brand.name}. Crafted for cinematic stories.</p></div><div><p className="mb-4 font-semibold text-cream">Quick Links</p><div className="grid gap-2 text-sm text-cream/55">{nav.map(([href,label])=><Link key={href} className="hover:text-gold" to={href}>{label}</Link>)}</div></div><div><p className="mb-4 font-semibold text-cream">Social</p><div className="grid gap-3 text-sm text-cream/55">{[['whatsapp',brand.whatsapp,'WhatsApp'],['instagram',brand.instagram,'Instagram'],['youtube',brand.youtube,'YouTube'],['linkedin',brand.linkedin,'LinkedIn']].map(([name,url,label])=><a key={name} className="flex items-center gap-3 hover:text-gold" href={url} target="_blank" rel="noreferrer"><img src={brand.socialIcons[name]} alt={label} className="h-5 w-5 object-contain"/>{label}</a>)}</div></div></div></footer>
 </div>
}
