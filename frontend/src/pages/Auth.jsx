import { useSearchParams } from 'react-router-dom'
import AuthCarousel from '../components/AuthCarousel'
import AuthForm from '../components/AuthForm'

export default function Auth({ defaultMode='signin' }){
  const [params]=useSearchParams()
  const raw=params.get('mode') || defaultMode
  const mode=['signup','register'].includes(raw) ? 'signup' : 'signin'
  return <section className="min-h-screen bg-ink lg:grid lg:grid-cols-[1.05fr_.95fr]"><AuthCarousel/><div className="grid min-h-screen place-items-center p-6 sm:p-10"><AuthForm mode={mode}/></div></section>
}
