import { Link, useSearchParams } from 'react-router-dom'
import AuthCarousel from '../components/AuthCarousel'
import AuthForm from '../components/AuthForm'
import ThemeToggle from '../components/ThemeToggle'
import BrandLogo from '../components/BrandLogo'

export default function Auth({ defaultMode = 'signin' }) {
  const [params] = useSearchParams()
  const raw = params.get('mode') || defaultMode
  const mode = ['signup', 'register'].includes(raw) ? 'signup' : 'signin'

  return (
    <section className="auth-shell min-h-[100dvh] bg-ink lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <AuthCarousel />

      <div className="relative grid min-h-[100dvh] place-items-center p-5 sm:p-10">
        <div className="absolute left-4 right-4 top-4 z-20 flex items-center justify-between sm:left-8 sm:right-8 sm:top-6">
          <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 light:border-black/10 light:bg-black/5">
            <BrandLogo className="h-8 w-8" />
            <span className="text-sm font-semibold text-cream light:text-charcoal">Home</span>
          </Link>
          <ThemeToggle compact />
        </div>

        <div className="auth-panel w-full max-w-md rounded-[2rem] p-6 sm:p-8">
          <AuthForm mode={mode} />
        </div>
      </div>
    </section>
  )
}
