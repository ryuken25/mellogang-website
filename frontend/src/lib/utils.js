import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) { return twMerge(clsx(inputs)) }
export function rupiah(value = 0) {
  const n = Number(value || 0)
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}
export function statusTone(status = '') {
  const s = String(status).toLowerCase()
  if (['valid', 'selesai', 'done', 'revisi_selesai'].some(x => s.includes(x))) return 'text-emerald-200 bg-emerald-400/10 border-emerald-300/20'
  if (['tolak', 'batal', 'gagal'].some(x => s.includes(x))) return 'text-rose-200 bg-rose-400/10 border-rose-300/20'
  if (['menunggu', 'pending', 'proses', 'shooting', 'cut', 'finish', 'pra'].some(x => s.includes(x))) return 'text-amber-100 bg-gold/10 border-gold/30'
  return 'text-cream/75 bg-white/5 border-white/10'
}
