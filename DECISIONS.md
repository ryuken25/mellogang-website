# DECISIONS — MellogangVisuals v2

Dokumen ini mencatat keputusan teknis yang diambil selama overhaul.
Versi: 2026-06-14 (mulai).

## 1. Stack tetap CodeIgniter 4

- Tidak ditulis ulang ke Laravel/Node. Alasan: (a) PHP/CI4 murah & universal
  untuk shared hosting, (b) logika bisnis (state machine revisi, snapshot
  pembayaran, RBAC) sudah ada dan kompleks, (c) target "1x jalan, no bug"
  tidak realistis kalau rewrite dari nol.
- Upgrade target: **CodeIgniter 4.7.x stabil** (saat ini `^4.0` di
  composer.json, akan di-pin ke `^4.7`).
- Runtime: **PHP 8.2** (sudah tersedia di environment: PHP 8.2.12).
- DB: MySQL/MariaDB, InnoDB, utf8mb4_unicode_ci.

## 2. Hosting: VPS untuk social fetch

- App PHP sendiri ringan & jalan di shared hosting.
- Tapi Playwright (Chromium) untuk auto-fetch YouTube/IG butuh Node + RAM.
- Catatan jujur ke Atar: fitur social fetch → **VPS kecil (~1GB RAM)**
  dengan Node + Chromium terinstall. Sisanya tetap ringan.

## 3. Skema disatukan

- Skema lama (yang sudah ada + yang modified via MIG baru) **tidak di-drop**.
  Semua perubahan skema lewat migration baru **idempotent** (`tableExists` /
  `fieldExists` guard).
- Backfill: `email_verified_at` di-set ke `created_at` untuk user lama
  (akun seeder) supaya tidak terkunci verifikasi.

## 4. Status: normalisasi kanonik (lowercase, snake_case)

Nilai kanonik yang dipakai seluruh aplikasi via `App\Support\Status`:

### status_pemesanan
- `menunggu_pembayaran`
- `menunggu_pelunasan`
- `menunggu_verifikasi`
- `lunas`
- `revisi_pelanggan`
- `revisi_diproses`
- `serah_terima_hasil`
- `selesai`
- `batal`
- `ditolak`

### status_produksi
- `pra_produksi`
- `shooting`
- `cut_to_cut`
- `finishing`
- `done`
- `revisi`
- `revisi_selesai`

### status_verifikasi
- `menunggu`
- `valid`
- `ditolak`

Mapping data-fix dijalankan di migration `NormalizeStatusValues` untuk
mengkonversi varian lama (mis. `'Pra produksi'` → `'pra_produksi'`,
`'Menunggu pembayaran'` → `'menunggu_pembayaran'`). Setelah itu, **tidak
ada lagi query `LOWER(col) = '...'`** — index kepakai.

## 5. Auth overhaul

- **Email normalizer**: `App\Libraries\EmailNormalizer`. Aturan:
  - trim + strtolower
  - `googlemail.com` → `gmail.com`
  - Untuk `gmail.com`: hapus semua `.` di local, potong di `+` pertama
  - Untuk domain lain: potong di `+` pertama, **titik tetap**
  - Simpan hasil di `user.email_canonical` (UNIQUE) — lookup/dedup pakai
    kolom ini, kolom `email` tetap menyimpan apa yang diketik user.
- **Register OTP**: form baru dengan field sesuai. Saat submit: buat user
  dengan `email_verified_at = NULL`, generate OTP 6 digit + token acak,
  simpan hash di `auth_token(type=verify_email, expires=+15m)`. Halaman
  verifikasi menerima OTP atau klik link. Login diblokir sampai verified.
- **Google OAuth**: pakai `league/oauth2-google`. Route
  `/auth/google/redirect` & `/auth/google/callback`. Lookup by
  `google_id` atau `email_canonical`. Auto-link atau auto-create dengan
  `auth_provider='google'`, `email_verified_at=now`.
- **Lockout**: tiap gagal `failed_login_attempts++`. Saat >= 4 → set
  `locked_until = now + 30m` + generate token `unlock` + kirim email
  berisi link unlock. Login ditolak selama lock. CI4 Throttler dipasang
  di endpoint login/register/OTP-resend/unlock (basis IP).
- **CSRF**: diaktifkan di semua POST.

## 6. SMTP

- Pakai CI4 Email service bawaan. Konfigurasi via `.env`. TIDAK pakai
  PHPMailer (overkill).
- `App\Libraries\Mailer` sebagai wrapper. Try/catch semua, tidak pernah
  melempar ke flow user (cukup log + flash warning).
- 4 jenis email:
  1. Verifikasi akun (OTP + link)
  2. Buka kunci akun (link unlock)
  3. Invoice (HTML + PDF attachment via dompdf)
  4. Hasil siap (idempotent, hanya jika ada `link_hasil`)

## 7. Deliverable: Google Drive link

- Editor/admin menempel URL Drive di field `jadwal_produksi.link_hasil`.
- Validasi host `drive.google.com` / `docs.google.com`. App **tidak
  mem-proxy file** — cuma menyimpan & meneruskan link.
- Pemicu email "hasil siap" di `Editor/TugasController::update` saat
  status produksi bergerak ke `finishing` / `done` / `revisi_selesai`
  **dan** ada `link_hasil`. **Idempotent**: hash link, kalau sama
  dengan `link_hasil_hash` yang tersimpan → **skip kirim**.
- Halaman status publik + dashboard pelanggan tampilkan tombol "Unduh
  Hasil" yang rapi saat order di `serah_terima_hasil` / `selesai`.

## 8. Social fetcher (Playwright)

- Worker Node ada di `tools/social-fetcher/`. Dipanggil via
  `proc_open`/`exec` (background) dari endpoint
  `POST /admin/social/fetch` (admin-only, CSRF).
- Dashboard polling `GET /admin/social/status?job=<id>` tiap ~3 detik.
- Halaman portofolio publik baca dari cache `social_post` — **tidak**
  scraping saat visitor buka.
- Mode `--fixture` untuk test deterministik (mengembalikan JSON kalengan).
- IG: pakai `storageState` dari `writable/secure/ig_state.json` (gitignored).
- Rate/selector IG bisa berubah; perlu maintenance. Catat jujur.

## 9. UI redesign

- Tema gelap-sinematik, primary teal `#00F5B8` (sampling dari logo).
- Token CSS di satu file `public/assets/css/app.css`. Hapus blok
  `<style>` inline yang tersebar.
- Font self-host (woff2) di `public/assets/fonts/`:
  Heading: Space Grotesk, Body: Inter.
- Favicon dari logo. Open Graph meta di layout utama.
- Mobile-first, AA kontras, dukung `prefers-reduced-motion`.
- Restyle markup; **nama route/URL tidak diubah**.

## 10. Security headers

- `SecureHeaders` CI4 diaktifkan + tambahan di App\Filters\SecurityHeaders:
  CSP (`default-src 'self'` + img untuk `i.ytimg.com`, IG CDN, Google
  avatar), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options:
  nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- Session: `httponly=true`, `samesite=Lax`, `secure` di production,
  `regenerate` saat login.

## 11. Testing

- **PHPUnit** (unit/integration): EmailNormalizer (tabel kasus),
  Status state machine, idempotensi email hasil, UNIQUE
  `email_canonical`.
- **Playwright e2e**: register+OTP, lockout+unlock, dot-trick,
  order flow, editor progress with Drive link, social fetch
  (fixture mode).
- **Capture email test**: CI4 Email → file-spool
  (`writable/email-spool/`) di env testing. Assert isi spool.

## 12. ./pages (screenshots + docs)

- Tool Playwright di `tools/screenshots/` login pakai akun seeder
  (admin/editor/pelanggan), screenshot setiap halaman di desktop
  1440 + mobile 390.
- Simpan ke `./pages/screenshots/<area>/<nama>.png` (area:
  publik, akun, pelanggan, admin, editor).
- Generate `./pages/README.md` (natural, bahasa Indonesia) +
  `MellogangVisuals-Pages.pdf`.

## 13. .env.example & .gitignore

- `.env.example` lengkap + komentar.
- `.gitignore` include `.env`, `ig_state.json`, `writable/secure/`,
  `writable/email-spool/`, `writable/social-debug/`, `node_modules`,
  `test-results/`, `playwright-report/`.

## 14. Catatan jujur / keterbatasan

- Social fetcher IG = area abu-abu ToS. Untuk produksi serius
  pertimbangkan Graph API resmi (perlu app review Meta).
- Email "cek Spam/Promosi" ditampilkan di setiap email & halaman
  verifikasi karena SMTP gratisan (Gmail/Yahoo) sering masuk Spam di
  first-send.
- Backup rutin tetap penting; revisi pakai `git` jadi catatan
  perubahan bisa ditelusuri.

## 15. Tahapan eksekusi (urutan)

1. Inventory (✓) + DECISIONS.md (✓) — file ini
2. `composer update` ke CI 4.7.x + install OAuth/dompdf
3. Migrations (drift fix, FK, index, normalisasi status, uang, kolom
   auth, tabel baru, link_hasil)
4. EmailNormalizer + unit test
5. Auth (OTP, Google, lockout, throttle, CSRF)
6. Mailer + 4 email + invoice PDF
7. Drive flow + idempotent email
8. UI redesign
9. Social fetcher worker + endpoint + UI
10. Hardening header/session
11. PHPUnit + Playwright
12. ./pages screenshot + README
13. .env.example + .gitignore + README + push
14. Final verify + cetak MANUAL STEPS
