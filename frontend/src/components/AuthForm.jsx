import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { brand } from '../data/brandData'
import { backendUrl } from '../lib/api'
import GoogleButton from './GoogleButton'
import { useAuth } from '../hooks/useAuth'

export default function AuthForm({ mode }){
  const isSignup=mode==='signup'
  const navigate=useNavigate()
  const [params]=useSearchParams()
  const { login } = useAuth()
  const redirectTo = params.get('redirect') || '/status'
  const [show,setShow]=useState(false), [showConfirm,setShowConfirm]=useState(false), [loading,setLoading]=useState(false), [error,setError]=useState('')
  const [form,setForm]=useState({ nama_lengkap:'', email:'', no_telepon:'', password:'', password_confirm:'', remember:false })
  const action=backendUrl(isSignup?'/register':'/login')
  const valid=useMemo(()=>{ if(!form.email.includes('@')) return false; if(form.password.length<5) return false; if(isSignup && (!form.nama_lengkap || !form.no_telepon || form.password!==form.password_confirm)) return false; return true },[form,isSignup])
  async function submit(e){
    e.preventDefault(); setError('')
    if(!valid){ setError(isSignup && form.password!==form.password_confirm ? 'Password confirmation must match.' : 'Isi email valid dan password minimal 5 karakter. Demo: dummy@dummy.com / dummy'); return }
    if(!isSignup){
      try { setLoading(true); await login(form.email, form.password); navigate(redirectTo, { replace:true }); return }
      catch(err){ setError(err.message); setLoading(false); return }
    }
    if(!action || action === '/register') { setError('Backend register belum terhubung. Untuk demo, login memakai dummy@dummy.com / dummy.'); return }
    e.currentTarget.submit()
  }
  return <div className="w-full max-w-md"><img src={brand.logo} alt="Mellogang Visuals logo" className="h-16 w-16 rounded-3xl border border-gold/30 object-cover shadow-glow"/><h2 className="mt-6 text-4xl font-semibold tracking-[-.04em] text-cream">{isSignup?'Start your visual story':'Welcome back to Mellogang Visuals'}</h2><p className="subtle mt-3">Book, track, and manage your photo-video production in one cinematic workspace.</p>
    <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/10 p-3 text-xs text-cream/70">Demo login: <b>dummy@dummy.com</b> / <b>dummy</b></div>
    <div className="mt-5"><GoogleButton/></div><div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[.24em] text-cream/35"><span className="h-px flex-1 bg-white/10"/>or continue with email<span className="h-px flex-1 bg-white/10"/></div>
    <form action={action} method="post" onSubmit={submit} className="space-y-4">{isSignup&&<input name="nama_lengkap" className="input-dark" placeholder="Full name" value={form.nama_lengkap} onChange={e=>setForm({...form,nama_lengkap:e.target.value})}/>}<input name="email" type="email" className="input-dark" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>{isSignup&&<input name="no_telepon" className="input-dark" placeholder="WhatsApp number" value={form.no_telepon} onChange={e=>setForm({...form,no_telepon:e.target.value})}/>}<div className="relative"><input name="password" type={show?'text':'password'} className="input-dark pr-12" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" onClick={()=>setShow(!show)} className="absolute right-4 top-3 text-cream/45">{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{isSignup&&<div className="relative"><input name="password_confirm" type={showConfirm?'text':'password'} className="input-dark pr-12" placeholder="Confirm password" value={form.password_confirm} onChange={e=>setForm({...form,password_confirm:e.target.value})}/><button type="button" onClick={()=>setShowConfirm(!showConfirm)} className="absolute right-4 top-3 text-cream/45">{showConfirm?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>}{error&&<div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}<button disabled={loading} className="btn-primary w-full disabled:opacity-60">{loading&&<Loader2 className="animate-spin" size={16}/>} {isSignup?'Create Account':'Sign In'}</button></form>
    <p className="mt-5 text-center text-xs leading-6 text-cream/45">By continuing, you agree to be contacted about your booking and production updates.</p><button className="btn-secondary mt-5 w-full" onClick={()=>navigate(`/auth?mode=${isSignup?'signin':'signup'}${params.get('redirect') ? `&redirect=${encodeURIComponent(params.get('redirect'))}` : ''}`)}>{isSignup?'Sudah punya akun? Sign in':'Belum punya akun? Create account'}</button><Link to="/" className="mt-4 block text-center text-sm text-cream/45 hover:text-gold">Back to website</Link>
  </div>
}
