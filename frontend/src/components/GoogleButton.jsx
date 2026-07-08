import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const backendBase = (import.meta.env.VITE_BACKEND_BASE_URL || import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
const googleUrl = import.meta.env.VITE_GOOGLE_AUTH_URL || (backendBase ? `${backendBase}/auth/google/redirect` : '')
export default function GoogleButton(){
  const [loading,setLoading]=useState(false)
  const disabled=!googleUrl
  return <div>
    <button type="button" disabled={disabled||loading} onClick={()=>{ if(!googleUrl) return; setLoading(true); window.location.href=googleUrl }} className="btn-secondary w-full disabled:cursor-not-allowed disabled:opacity-55">
      {loading ? <Loader2 className="animate-spin" size={16}/> : <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-black">G</span>} Continue with Google
    </button>
    {disabled && <p className="mt-2 text-center text-xs text-cream/45">Google login requires backend connection.</p>}
  </div>
}
