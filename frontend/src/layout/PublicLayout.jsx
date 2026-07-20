import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, Sparkles, UserRound } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'
import { brand } from '../data/brandData'
import { useAuth } from '../hooks/useAuth'
import ThemeToggle from '../components/ThemeToggle'
import BrandLogo from '../components/BrandLogo'

const nav = [
  ['/', 'Home'],
  ['/katalog', 'Katalog'],
  ['/portofolio', 'Portofolio'],
  ['/status-pesanan', 'Status Pesanan'],
  ['/kontak', 'Kontak'],
]

function SocialIcon({ name, url }) {
  return (
    <a
      className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10 light:bg-black/5 light:hover:bg-black/10"
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <img src={brand.socialIcons[name]} alt={name} className="h-5 w-5 object-contain" />
    </a>
  )
}

function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  if (!isAuthenticated) return <Link className="btn-secondary" to="/auth?mode=signin">Login</Link>
  const initials =
    user.avatarInitials ||
    user.name?.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase() ||
    'MV'
  const go = (to) => {
    setOpen(false)
    navigate(to)
  }
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 text-left hover:border-gold/40 light:border-black/10 light:bg-black/5"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-gold text-sm font-bold text-black">{initials}</span>
        <span className="hidden max-w-[150px] lg:block">
          <b className="block truncate text-sm text-cream light:text-charcoal">{user.name || user.email}</b>
          <small className="block truncate text-cream/45 light:text-black/45">{user.email}</small>
        </span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-[#0d1110]/95 p-2 shadow-2xl backdrop-blur-xl light:bg-[#fffaf0]/95">
          <button onClick={() => go('/profile')} className="w-full rounded-2xl px-4 py-3 text-left text-sm hover:bg-white/10 light:hover:bg-black/5">Profile</button>
          <button onClick={() => go('/profile/edit')} className="w-full rounded-2xl px-4 py-3 text-left text-sm hover:bg-white/10 light:hover:bg-black/5">Edit Profile</button>
          <button onClick={() => go('/status')} className="w-full rounded-2xl px-4 py-3 text-left text-sm hover:bg-white/10 light:hover:bg-black/5">Status Pesanan</button>
          <div className="px-2 py-2"><ThemeToggle /></div>
          <button
            onClick={() => {
              logout()
              setOpen(false)
              navigate('/')
            }}
            className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-sm text-red-200 hover:bg-red-500/10"
          >
            <LogOut size={16} />Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/70 backdrop-blur-2xl light:border-black/10 light:bg-[#fff7ea]/80">
        <div className="container-premium flex h-20 items-center justify-between">
          <Link to="/" className="relative flex items-center pr-2" aria-label="Mellogang Visuals home">
            <BrandLogo className="h-11 w-11 sm:h-12 sm:w-12" showWordmark />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map(([href, label]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm text-cream/65 hover:bg-white/5 hover:text-cream light:text-black/60 light:hover:bg-black/5 light:hover:text-charcoal',
                    isActive && 'bg-white/10 text-cream light:bg-black/10 light:text-charcoal',
                    href === '/portofolio' && 'border border-gold/20'
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle compact />
            <SocialIcon name="instagram" url={brand.instagram} />
            <SocialIcon name="youtube" url={brand.youtube} />
            <UserMenu />
            <a className="btn-primary" href={brand.whatsapp} target="_blank" rel="noreferrer">
              <Sparkles size={16} />Booking
            </a>
          </div>

          <button className="text-cream light:text-charcoal lg:hidden" onClick={() => setOpen(!open)}>
            <Menu />
          </button>
        </div>

        {open && (
          <div className="container-premium pb-5 lg:hidden">
            {nav.map(([href, label]) => (
              <NavLink
                onClick={() => setOpen(false)}
                key={href}
                to={href}
                className="block rounded-2xl px-4 py-3 text-cream/80 hover:bg-white/5 light:text-black/70 light:hover:bg-black/5"
              >
                {label}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <ThemeToggle />
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout()
                    setOpen(false)
                    navigate('/')
                  }}
                  className="btn-secondary flex-1"
                >
                  Logout {user?.name}
                </button>
              ) : (
                <Link onClick={() => setOpen(false)} className="btn-secondary flex-1" to="/auth?mode=signin">
                  Login
                </Link>
              )}
            </div>
            {isAuthenticated && (
              <Link onClick={() => setOpen(false)} className="btn-secondary mt-3 w-full" to="/profile/edit">
                <UserRound size={16} />Edit Profile
              </Link>
            )}
            <a className="btn-primary mt-3 w-full" href={brand.whatsapp} target="_blank" rel="noreferrer">
              Booking WhatsApp
            </a>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/10 py-12 light:border-black/10">
        <div className="container-premium grid gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <div className="relative flex items-center gap-3">
              <BrandLogo className="h-12 w-12" showWordmark />
            </div>
            <p className="subtle mt-5 max-w-md">{brand.description}</p>
            <p className="mt-6 text-sm text-cream/45 light:text-black/45">
              © 2026 {brand.name}. Crafted for cinematic stories.
            </p>
          </div>
          <div>
            <p className="mb-4 font-semibold text-cream light:text-charcoal">Quick Links</p>
            <div className="grid gap-2 text-sm text-cream/55 light:text-black/55">
              {nav.map(([href, label]) => (
                <Link key={href} className="hover:text-gold" to={href}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 font-semibold text-cream light:text-charcoal">Social</p>
            <div className="grid gap-3 text-sm text-cream/55 light:text-black/55">
              {[
                ['whatsapp', brand.whatsapp, 'WhatsApp'],
                ['instagram', brand.instagram, 'Instagram'],
                ['youtube', brand.youtube, 'YouTube'],
                ['linkedin', brand.linkedin, 'LinkedIn'],
              ].map(([name, url, label]) => (
                <a key={name} className="flex items-center gap-3 hover:text-gold" href={url} target="_blank" rel="noreferrer">
                  <img src={brand.socialIcons[name]} alt={label} className="h-5 w-5 object-contain" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
