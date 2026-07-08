import { portfolioItems } from './portfolioData'
export const services = ['Wedding', 'Prewedding', 'Ceremony', 'Graduation', 'Event', 'Creative / Music Visual']
export const packages = [
  { id_paket: 1, nama_paket: 'Wedding Signature Film', kategori: 'Wedding', harga: 7500000, durasi_jam: 8, deskripsi: 'Full-day cinematic coverage, highlight film, edited photos, cloud delivery.' },
  { id_paket: 2, nama_paket: 'Prewedding Editorial', kategori: 'Prewedding', harga: 4200000, durasi_jam: 5, deskripsi: 'Creative direction, moodboard, premium retouch, short teaser reel.' },
  { id_paket: 3, nama_paket: 'Event & Ceremony Story', kategori: 'Event', harga: 5500000, durasi_jam: 6, deskripsi: 'Multi-angle event or ceremony coverage with dynamic recap and social cutdowns.' },
  { id_paket: 4, nama_paket: 'Creative Visual Campaign', kategori: 'Creative', harga: 3800000, durasi_jam: 4, deskripsi: 'Story-driven photo-video production for music, brand, and creative visual concepts.' },
]
export const portfolio = portfolioItems.map((p, i) => ({ id_portfolio: i + 1, judul: p.title, kategori: p.category.toLowerCase(), deskripsi: p.description, thumb: p.thumbnail, url_media: p.url }))
export const orders = [
  { kode_pemesanan: 'MLG260708A1', nama_paket: 'Wedding Signature Film', status_pemesanan: 'menunggu_pembayaran', status_produksi: 'pra_produksi', progress: 28, total_biaya: 7500000, tanggal_acara: '2026-08-20' },
  { kode_pemesanan: 'MLG260708B2', nama_paket: 'Event & Ceremony Story', status_pemesanan: 'diproses', status_produksi: 'cut_to_cut', progress: 62, total_biaya: 5500000, tanggal_acara: '2026-08-02' },
  { kode_pemesanan: 'MLG260708C3', nama_paket: 'Creative Visual Campaign', status_pemesanan: 'selesai', status_produksi: 'done', progress: 100, total_biaya: 3800000, tanggal_acara: '2026-07-25' },
]
export const testimonials = [
  { name: 'Wedding Story', text: 'Visual yang terasa intimate dan cinematic untuk momen yang cuma terjadi sekali.' },
  { name: 'Ceremony Moment', text: 'Frame real dari ritual, keluarga, dan ambience Bali yang ditangkap dengan rapi.' },
  { name: 'Creative Visual', text: 'Produksi photo-video dibuat lebih jelas: konsep, booking, progress, dan delivery.' },
]
