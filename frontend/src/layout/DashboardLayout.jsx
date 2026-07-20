import BrandLogo from '../components/BrandLogo'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard } from 'lucide-react'
import { cn } from '../lib/utils'
import { brand } from '../data/brandData'
const items=[['/dashboard/admin','Admin'],['/dashboard/editor','Editor'],['/dashboard/pelanggan','Pelanggan']]
export default function DashboardLayout(){return <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]"><aside className="border-r border-white/10 bg-black/35 light:border-black/10 light:bg-[#fff7ea] p-5"><Link to="/" className="mb-8 flex items-center gap-3"><BrandLogo className="h-11 w-11"/></Link><nav className="flex gap-2 overflow-auto lg:block lg:space-y-2">{items.map(([href,label])=><NavLink key={href} to={href} className={({isActive})=>cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-cream/65 hover:bg-white/5 light:text-black/60 light:hover:bg-black/5',isActive&&'bg-gold/10 text-gold')}><LayoutDashboard size={16}/>{label}</NavLink>)}</nav></aside><main className="p-4 sm:p-8"><Outlet/></main></div>}
