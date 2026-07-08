import { portfolioItems } from './portfolioData'
export { mockOrders as orders } from './mockOrders'
export const services = ['Wedding', 'Prewedding', 'Ceremony', 'Graduation', 'Event', 'Creative / Music Visual']
export const packages = [
  { id_paket: 1, nama_paket: 'Wedding Cinematic Highlight', kategori: 'Wedding', harga: 4500000, durasi_jam: 6, deskripsi: 'Cinematic wedding coverage for intimate traditional ceremonies and warm family moments.', deliverables: ['1 cinematic highlight film', 'Edited photo selection', 'Color grading', 'Online delivery gallery'] },
  { id_paket: 2, nama_paket: 'Wedding Signature Film', kategori: 'Wedding', harga: 7500000, durasi_jam: 8, deskripsi: 'Full-day cinematic coverage, highlight film, edited photos, and cloud delivery for wedding stories.', deliverables: ['Full-day coverage', 'Cinematic highlight film', 'Edited photo selection', 'Online delivery gallery'] },
  { id_paket: 3, nama_paket: 'Prewedding Editorial', kategori: 'Prewedding', harga: 4200000, durasi_jam: 5, deskripsi: 'Editorial prewedding session with creative direction, moodboard, premium retouch, and teaser reel.', deliverables: ['Creative direction', 'Prewedding photo session', 'Premium retouch', 'Short teaser reel'] },
  { id_paket: 4, nama_paket: 'Event & Ceremony Story', kategori: 'Event', harga: 5500000, durasi_jam: 6, deskripsi: 'Multi-angle event or ceremony coverage with dynamic recap, candid details, and social cutdowns.', deliverables: ['Event recap video', 'Candid photo selection', 'Social media cutdowns', 'Online delivery'] },
  { id_paket: 5, nama_paket: 'Graduation Memory Package', kategori: 'Graduation', harga: 2800000, durasi_jam: 3, deskripsi: 'Warm graduation documentation for personal milestones, family moments, and campus portraits.', deliverables: ['Graduation portrait session', 'Family candid photos', 'Edited photo selection', 'Short vertical reel'] },
  { id_paket: 6, nama_paket: 'Creative Visual Campaign', kategori: 'Creative', harga: 3800000, durasi_jam: 4, deskripsi: 'Story-driven photo-video production for music, brand, product, and creative visual concepts.', deliverables: ['Concept planning', 'Photo-video production', 'Color grading', 'Campaign-ready files'] },
]
export const portfolio = portfolioItems.map((p, i) => ({ id_portfolio: i + 1, judul: p.title, kategori: p.category.toLowerCase(), deskripsi: p.description, thumb: p.thumbnail, url_media: p.url }))
export const testimonials = [
  { name: 'Wedding Story', text: 'Visual yang terasa intimate dan cinematic untuk momen yang cuma terjadi sekali.' },
  { name: 'Ceremony Moment', text: 'Ritual, keluarga, dan ambience Bali ditangkap dengan rapi dan natural.' },
  { name: 'Creative Visual', text: 'Produksi photo-video dibuat lebih jelas: konsep, booking, progress, dan delivery.' },
]
