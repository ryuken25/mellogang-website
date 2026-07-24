// Mock data untuk area admin — UI jalan penuh tanpa backend (demo mode).
// Kalau nanti dipasang ke API (CI4 / serverless), ganti sumber di sini saja.

export const STATUS = {
  BARU: { label: 'BARU', tone: 'gold' },
  MENUNGGU_BAYAR: { label: 'MENUNGGU BAYAR', tone: 'gold' },
  DIBAYAR: { label: 'DIBAYAR', tone: 'green' },
  PRODUKSI: { label: 'PRODUKSI', tone: 'purple' },
  SELESAI: { label: 'SELESAI', tone: 'green' },
  BATAL: { label: 'BATAL', tone: 'gray' },
  PENDING: { label: 'PENDING', tone: 'gold' },
  VALID: { label: 'VALID', tone: 'green' },
  INVALID: { label: 'INVALID', tone: 'red' },
}

export const initialOrders = [
  { id: 'MG-2440', klien: 'Kadek Ayu', paket: 'Full Day Cinematic', tglAcara: '12 Nov 2026', lokasi: 'Canggu', total: 4500000, status: 'BARU' },
  { id: 'MG-2439', klien: 'Gede & Ayu', paket: 'Ceremony & Adat', tglAcara: '2 Okt 2026', lokasi: 'Ubud', total: 3000000, status: 'BARU' },
  { id: 'MG-2438', klien: 'Sinta & Wira', paket: 'Prewedding Story', tglAcara: '10 Okt 2026', lokasi: 'Nusa Penida', total: 2500000, status: 'BARU' },
  { id: 'MG-2437', klien: 'Sinta & Wira', paket: 'Ceremony & Adat', tglAcara: '20 Okt 2026', lokasi: 'Tirta Empul', total: 3000000, status: 'MENUNGGU_BAYAR' },
  { id: 'MG-2436', klien: 'Dinda P.', paket: 'Prewedding Story', tglAcara: '2 Okt 2026', lokasi: 'Uluwatu', total: 2500000, status: 'MENUNGGU_BAYAR', timer: '11:42' },
  { id: 'MG-2433', klien: 'Kadek Dwi', paket: 'Ceremony & Adat', tglAcara: '30 Okt 2026', lokasi: 'Tirta Empul', total: 3000000, status: 'DIBAYAR' },
  { id: 'MG-2419', klien: 'Dinda & Raka', paket: 'Full Day Cinematic', tglAcara: '14 Sep 2026', lokasi: 'Sanur', total: 4500000, status: 'PRODUKSI' },
  { id: 'MG-2415', klien: 'Made W.', paket: 'Event Highlight', tglAcara: '30 Agu 2026', lokasi: 'Denpasar', total: 2000000, status: 'PRODUKSI' },
  { id: 'MG-2401', klien: 'Putu Ayu', paket: 'Graduation Session', tglAcara: '12 Jul 2026', lokasi: 'UNUD', total: 1500000, status: 'SELESAI' },
  { id: 'MG-2398', klien: 'Komang T.', paket: 'Prewedding Story', tglAcara: '2 Jul 2026', lokasi: 'Kintamani', total: 2500000, status: 'SELESAI' },
  { id: 'MG-2390', klien: 'Rizky A.', paket: 'Event Highlight', tglAcara: '20 Jun 2026', lokasi: 'Kuta', total: 2000000, status: 'BATAL' },
]

export const initialPayments = [
  { id: 'PAY-812', order: 'MG-2437', klien: 'Sinta & Wira', nominal: 3000000, metode: 'BCA', pengirim: 'BCA · a.n. Sinta Dewi', waktu: '25 Jul · 07:12 WITA', umur: '2 jam lalu', gateway: 'manual', status: 'PENDING', bukti: '/brand/mellogang-og.jpg' },
  { id: 'PAY-811', order: 'MG-2431', klien: 'Wayan G.', nominal: 1500000, metode: 'BRI', pengirim: 'BRI · a.n. Wayan Gede', waktu: '25 Jul · 04:03 WITA', umur: '5 jam lalu', gateway: 'manual', status: 'PENDING', bukti: '/brand/mellogang-og.jpg' },
  { id: 'PAY-810', order: 'MG-2436', klien: 'Dinda P.', nominal: 2500000, metode: 'QRIS', pengirim: 'Midtrans · QRIS', waktu: '24 Jul · 20:14 WITA', umur: 'kemarin', gateway: 'midtrans', status: 'VALID' },
  { id: 'PAY-807', order: 'MG-2433', klien: 'Kadek Dwi', nominal: 3000000, metode: 'BCA', pengirim: 'BCA · a.n. Kadek Dwi', waktu: '23 Jul · 10:41 WITA', umur: '2 hari lalu', gateway: 'manual', status: 'VALID' },
  { id: 'PAY-801', order: 'MG-2429', klien: 'Agus P.', nominal: 500000, metode: 'BNI', pengirim: 'BNI · a.n. orang lain', waktu: '20 Jul · 15:22 WITA', umur: '5 hari lalu', gateway: 'manual', status: 'INVALID' },
]

export const editors = [
  { id: 1, nama: 'Komang', aktif: 3 },
  { id: 2, nama: 'Bayu', aktif: 1 },
  { id: 3, nama: 'Alit', aktif: 2 },
]

export const initialUnscheduled = [
  { order: 'MG-2433', paket: 'Ceremony & Adat', klien: 'Kadek Dwi', tgl: '30 Okt', lokasi: 'Tirta Empul', lunas: 'lunas 2 hari lalu', open: true },
  { order: 'MG-2438', paket: 'Prewedding', klien: 'Sinta & Wira', tgl: '10 Okt', lokasi: 'Nusa Penida', lunas: 'lunas kemarin', open: false },
]

export const initialDeliverables = [
  { order: 'MG-2419', editor: 'Komang', link: 'drive.google.com/…f8Kq', sent: false },
]

export const calendarOct = [
  { d: 28, out: true }, { d: 29, out: true }, { d: 30, out: true },
  { d: 1 },
  { d: 2, ev: [{ type: 'shoot', label: '🎥 MG-2436 · Gede+Ayu' }] },
  { d: 3, ev: [{ type: 'edit', label: '✂️ MG-2436 · Komang' }] },
  { d: 4 }, { d: 5 }, { d: 6 }, { d: 7 }, { d: 8 }, { d: 9 },
  { d: 10, ev: [{ type: 'shoot', label: '🎥 MG-2438' }] },
  { d: 11 }, { d: 12 }, { d: 13 },
  { d: 14, ev: [{ type: 'edit', label: '✂️ MG-2438 · Bayu' }] },
  { d: 15 }, { d: 16 }, { d: 17 }, { d: 18 }, { d: 19 }, { d: 20 },
  { d: 21 }, { d: 22 }, { d: 23 }, { d: 24 },
  { d: 25 }, { d: 26 }, { d: 27 },
  { d: 28 }, { d: 29 },
  { d: 30, ev: [{ type: 'shoot', label: '🎥 MG-2433 · Kadek Dwi' }] },
  { d: 31 }, { d: 1, out: true },
]

export const initialPackages = [
  { id: 1, nama: 'Full Day Cinematic', sub: 'film 4-6mnt + 300 foto', kategori: 'Wedding', harga: 4500000, aktif: true, thumb: '/brand/mellogang-og.jpg', deskripsi: 'Film 4-6 menit (4K) · 300+ foto edited · same-day teaser · drone · 2x revisi minor' },
  { id: 2, nama: 'Prewedding Story', sub: '2 lokasi Bali', kategori: 'Prewedding', harga: 2500000, aktif: true, thumb: '/brand/mellogang-og.jpg', deskripsi: 'Film 1-2 menit · 100+ foto edited · 2 lokasi · wardrobe consult' },
  { id: 3, nama: 'Ceremony & Adat', sub: 'melukat, metatah, odalan', kategori: 'Ceremony', harga: 3000000, aktif: true, thumb: '/brand/mellogang-og.jpg', deskripsi: 'Dokumentasi upacara penuh · highlight 3-4 menit · 200+ foto' },
  { id: 4, nama: 'Graduation Session', sub: '1 jam campus session', kategori: 'Graduation', harga: 1500000, aktif: true, thumb: '/brand/mellogang-og.jpg', deskripsi: 'Sesi 1 jam · 50+ foto edited · reel 30 detik' },
  { id: 5, nama: 'Engagement Mini', sub: '1 jam session', kategori: 'Prewedding', harga: 1000000, aktif: false, thumb: '/brand/mellogang-og.jpg', deskripsi: 'Sesi 1 jam · 40 foto edited' },
]

export const initialPortfolio = [
  { id: 1, judul: 'First look — Dinda & Raka', kategori: 'WEDDING', sumber: 'dari IG · 12 Jul', img: '/brand/mellogang-og.jpg' },
  { id: 2, judul: 'Melukat — Tirta Empul', kategori: 'CEREMONY', sumber: 'dari IG · 8 Jul', img: '/brand/mellogang-og.jpg' },
  { id: 3, judul: 'Wisuda UNUD — Putu Ayu', kategori: 'GRADUATION', sumber: 'manual · 2 Jul', img: '/brand/mellogang-og.jpg' },
  { id: 4, judul: 'Sunset session — Uluwatu', kategori: 'PREWEDDING', sumber: 'dari IG · 28 Jun', img: '/brand/mellogang-og.jpg' },
  { id: 5, judul: 'Corporate reel — Canggu', kategori: 'EVENT', sumber: 'manual · 20 Jun', img: '/brand/mellogang-og.jpg' },
]

export const fetchHistory = [
  { job: '#127', waktu: '24 Jul 2026 · 18:02', media: '+6 item', durasi: '3m 12s', status: 'SUKSES' },
  { job: '#126', waktu: '22 Jul 2026 · 09:15', media: '0 item', durasi: '0m 41s', status: 'GAGAL — TOKEN' },
  { job: '#125', waktu: '19 Jul 2026 · 20:30', media: '+12 item', durasi: '4m 55s', status: 'SUKSES' },
]

export const initialUsers = [
  { id: 1, nama: 'Dinda Paramitha', email: 'dinda@gmail.com', via: 'Google', daftar: '12 Jul 2026', role: 'PELANGGAN', aktif: true, hue: 'gold' },
  { id: 2, nama: 'Komang', email: 'komang@mellogang.id', via: '', daftar: '3 Feb 2025', role: 'EDITOR', aktif: true, hue: 'purple' },
  { id: 3, nama: 'Bayu', email: 'bayu@mellogang.id', via: '', daftar: '15 Mar 2025', role: 'EDITOR', aktif: true, hue: 'purple' },
  { id: 4, nama: 'Mello', email: 'admin@mellogang.id', via: '', daftar: '1 Jan 2025', role: 'ADMIN', aktif: true, hue: 'blue' },
  { id: 5, nama: 'Sinta Dewi', email: 'sinta.d@gmail.com', via: 'Google', daftar: '20 Jun 2026', role: 'PELANGGAN', aktif: true, hue: 'gold' },
  { id: 6, nama: 'Wayan Spam', email: 'wyn.spam@mail.com', via: '', daftar: '1 Jul 2026', role: 'PELANGGAN', aktif: false, hue: 'gray' },
]

export const revenue6m = [
  { m: 'FEB', v: 18 }, { m: 'MAR', v: 21 }, { m: 'APR', v: 17 },
  { m: 'MEI', v: 24 }, { m: 'JUN', v: 25.5 }, { m: 'JUL', v: 28.5, now: true },
]

export const rp = (n) =>
  n >= 1000000 && n % 100000 === 0
    ? `Rp ${(n / 1000000).toString().replace('.', ',')}jt`
    : `Rp ${n.toLocaleString('id-ID')}`

export const rpFull = (n) => `Rp ${n.toLocaleString('id-ID')}`
