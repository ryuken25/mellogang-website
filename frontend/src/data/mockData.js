import { portfolioItems } from './portfolioData'
export { mockOrders as orders } from './mockOrders'
export const services = ['Wedding', 'Prewedding', 'Ceremony', 'Graduation', 'Event', 'Creative / Music Visual']
export const packages = [
  { id_paket: 1, nama_paket: 'Wedding Signature Film', kategori: 'Wedding', harga: 7500000, durasi_jam: 8, deskripsi: 'Full-day cinematic coverage, highlight film, edited photos, cloud delivery.' },
  { id_paket: 2, nama_paket: 'Prewedding Editorial', kategori: 'Prewedding', harga: 4200000, durasi_jam: 5, deskripsi: 'Creative direction, moodboard, premium retouch, short teaser reel.' },
  { id_paket: 3, nama_paket: 'Event & Ceremony Story', kategori: 'Event', harga: 5500000, durasi_jam: 6, deskripsi: 'Multi-angle event or ceremony coverage with dynamic recap and social cutdowns.' },
  { id_paket: 4, nama_paket: 'Creative Visual Campaign', kategori: 'Creative', harga: 3800000, durasi_jam: 4, deskripsi: 'Story-driven photo-video production for music, brand, and creative visual concepts.' },
]
export const portfolio = portfolioItems.map((p, i) => ({ id_portfolio: i + 1, judul: p.title, kategori: p.category.toLowerCase(), deskripsi: p.description, thumb: p.thumbnail, url_media: p.url }))
export const testimonials = [
  { name: 'Wedding Story', text: 'Visual yang terasa intimate dan cinematic untuk momen yang cuma terjadi sekali.' },
  { name: 'Ceremony Moment', text: 'Ritual, keluarga, dan ambience Bali ditangkap dengan rapi dan natural.' },
  { name: 'Creative Visual', text: 'Produksi photo-video dibuat lebih jelas: konsep, booking, progress, dan delivery.' },
]
