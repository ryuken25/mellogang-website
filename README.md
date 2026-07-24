# MellogangVisuals — Ordering & Production Tracking System

Web app untuk mengelola pesanan layanan foto/video: katalog, portofolio,
pemesanan, verifikasi pembayaran, penjadwalan produksi, tracking progres
editing, dan serah terima hasil via Google Drive.

## Apa yang Baru (v2 / 2026-06-14)

- **Upgrade CodeIgniter ke 4.7.3** (composer.json pinned ke `^4.7`).
- **Auth overhaul**:
  - Register dengan verifikasi OTP via email.
  - Login dengan Google (`league/oauth2-google`).
  - Lockout 4x salah → link unlock via email (30 menit).
  - Throttler (IP) di login/register/OTP-resend/unlock.
  - CSRF di semua POST.
  - **Anti dot-trick & plus-alias**: `tes.s@gmail.com` dan
    `tess@gmail.com` dianggap akun yang sama. Dihandle oleh
    `App\Libraries\EmailNormalizer` dan kolom `user.email_canonical`
    (UNIQUE). Unit-tested.
- **Database**:
  - Migration drift fix (tabel `detail_pemesanan`, kolom
    `portofolio.thumbnail`).
  - Kolom auth: `email_canonical`, `email_verified_at`, `google_id`,
    `auth_provider`, `avatar_url`, `failed_login_attempts`,
    `locked_until`, `last_login_at`.
  - Kolom deliverable: `jadwal_produksi.link_hasil`,
    `link_hasil_hash`, `link_hasil_terkirim_at`.
  - Tabel baru: `auth_token`, `social_post`, `social_fetch_job`.
  - Index untuk kolom yang sering difilter (`pemesanan.status_pemesanan`,
    `jadwal_produksi.status_produksi`, composite, dll).
  - Status dinormalisasi ke bentuk kanonik (lowercase + snake_case)
    lewat `App\Support\Status`. Tidak ada lagi query `LOWER(col) = '...'`
    yang mematikan index.
  - Tipe uang di-widening ke `BIGINT UNSIGNED`.
- **SMTP**:
  - 4 jenis email branded (verifikasi OTP, unlock, invoice, hasil siap).
  - Invoice PDF via `dompdf/dompdf` (attachment).
  - Email "hasil siap" **idempotent** (hash link, jangan kirim dua kali).
- **UI redesign**: tema gelap-sinematik, primary teal `#00F5B8`,
  self-hosted fonts (Space Grotesk + Inter), favicon, OG meta.
- **Security headers** (`App\Filters\SecurityHeaders`): CSP, XFO, XCTO,
  Referrer-Policy, Permissions-Policy.
- **Social fetcher**: tombol admin-only di `/admin/social/fetch` →
  worker Node Playwright (`tools/social-fetcher/worker.js`) dengan mode
  fixture untuk test e2e deterministik. Portofolio publik baca dari
  cache `social_post` (tidak scraping saat visitor buka).
- **Testing**:
  - PHPUnit unit/integration (23 tests passing untuk EmailNormalizer,
    Status, ResultNotifier).
  - Playwright e2e (login tiap role, dot-trick, social fetch).
- **Dokumentasi & DECISIONS.md** di root.

Lihat [DECISIONS.md](DECISIONS.md) untuk detail keputusan teknis.

## Stack

- PHP 8.1+ (target runtime 8.2/8.3)
- CodeIgniter 4.7.3
- MySQL / MariaDB (InnoDB, utf8mb4)
- Bootstrap 5 + jQuery untuk komponen tertentu (modal pop-up)
- Composer (PHP), npm (Node Playwright worker + e2e tests)

## Roles

| Role | Namespace | Default route |
|------|-----------|---------------|
| Admin | `App\Controllers\Admin\` | `/admin` |
| Editor | `App\Controllers\Editor\` | `/editor` |
| Pelanggan | `App\Controllers\Pelanggan\` | `/pelanggan` |
| Public | `App\Controllers\Public\` | `/` |

## Local Setup

### Prasyarat

- PHP 8.1+ dengan ekstensi `intl`, `mbstring`, `mysqlnd`, `gd`, `curl`,
  `openssl`.
- Composer.
- MySQL/MariaDB.
- (Untuk social fetcher & e2e) Node 18+ LTS.

### Langkah

```bash
# 1. Install PHP dependencies
composer install

# 2. Salin env
cp .env.example .env
# edit .env sesuai database + (opsional) SMTP

# 3. Migrate + seed
php spark migrate
php spark db:seed DatabaseSeeder   # opsional

# 4. Jalankan
php spark serve --port 8080
# buka http://localhost:8080

# 5. (Opsional) Install Playwright untuk e2e + social fetcher
cd tools/social-fetcher
npm install
npx playwright install --with-deps chromium
cd ../..
cd tests/e2e
npm install
npx playwright install --with-deps chromium
cd ../..
```

## Demo Accounts (dari seeder)

Password semua akun: `123123`

| Role | Email |
|------|-------|
| Admin | `admin@mellogang.test` |
| Editor | `editor1@mellogang.test`, `editor@mellogang.test` |
| Pelanggan | `pengguna1@mellogang.test`, `pengguna2@mellogang.test`, `pengguna3@mellogang.test` |

## Testing

```bash
# Unit / integration (PHPUnit)
composer test
# atau
./vendor/bin/phpunit --no-coverage

# e2e (Playwright) — butuh server jalan di background
php spark serve --port 8080 &
cd tests/e2e
npm install
npx playwright install --with-deps chromium
npm test
```

## Pembayaran Otomatis (Midtrans)

Snap (sandbox-first) berjalan berdampingan dengan transfer manual + upload bukti.

- **Config**: `.env` → `midtrans.serverKey`, `midtrans.clientKey`,
  `midtrans.isProduction=false`, `midtrans.merchantId` (lihat `.env.example`).
  Dibaca `app/Config/Midtrans.php`.
- **Flow**: halaman upload pembayaran punya blok "Bayar Otomatis (QRIS /
  e-Wallet / VA)". Klik → `POST /pelanggan/pembayaran/{id}/snap-token`
  (ownership + CSRF) → popup Snap. **Callback browser tidak pernah menandai
  lunas** — status final selalu dari webhook `POST /payment/midtrans/notify`
  (signature sha512, CSRF-exempt, idempotent: hanya upgrade
  menunggu→ditolak→valid). UI mem-polling `GET /pelanggan/pembayaran/{id}/status`.
- **Data**: `pembayaran.gateway` = `manual|midtrans` + kolom
  `midtrans_order_id` (UNIQUE), `snap_token`, `payment_type`,
  `transaction_status`, `gross_amount`, `paid_at`. Semua payload webhook
  di-log ke `payment_notification` (termasuk yang signature-nya invalid).
- **Admin**: baris Midtrans dapat badge; yang sudah settle read-only —
  webhook satu-satunya sumber kebenaran.

### Manual test plan (sandbox)

1. Set Notification URL sandbox (butuh tunnel utk lokal):
   `cloudflared tunnel --url http://localhost:8080` lalu di
   https://dashboard.sandbox.midtrans.com → Settings → Configuration →
   Payment Notification URL = `https://<tunnel>/payment/midtrans/notify`.
2. Login pelanggan → halaman pembayaran → "Bayar Sekarang" (pilih DP/Pelunasan).
3. Di popup Snap pilih QRIS → scan pakai https://simulator.sandbox.midtrans.com
   (QRIS) → riwayat auto-refresh jadi `valid` setelah webhook masuk.
4. VA: pilih bank transfer → bayar VA di simulator (BCA/BNI/dll).
5. Kartu: `4811 1111 1111 1114`, exp bebas ke depan, CVV `123`, OTP `112233`.
6. Skenario expire: buat transaksi, biarkan / set expire dari dashboard
   sandbox → status jadi `ditolak` via webhook, pelanggan bisa bayar ulang.
7. Idempotency: kirim ulang notifikasi dari dashboard (Resend) → respons
   `no_state_change`, tidak ada perubahan kedua.

## File Upload Paths

- Bukti bayar: `writable/uploads/pembayaran/`
- Avatar: `writable/uploads/avatars/`
- Portofolio: `public/uploads/portofolio/`
- File preview produksi: `writable/uploads/progres/{id_jadwal}/`
- IG storageState: `writable/secure/ig_state.json` (**JANGAN** commit)
- Email spool (testing): `writable/email-spool/`
- Invoice PDF sementara: `writable/invoice-tmp/`

## Catatan Deploy

- **PHP app** ringan, jalan di shared hosting biasa.
- **Social fetcher** butuh Node + Chromium → wajib **VPS kecil (≥1GB RAM)**.
  Lihat `tools/social-fetcher/README.md` (TODO) atau
  [DECISIONS.md §2](DECISIONS.md#2-hosting-vps-untuk-social-fetch).
- IG scraping = area abu-abu ToS. Untuk produksi serius, pertimbangkan
  Graph API resmi (perlu app review Meta).
- Email SMTP gratisan (Gmail/Yahoo) sering masuk Spam di first-send —
  aplikasi selalu menampilkan catatan "Cek Spam/Promosi".

## Lisensi

Educational / portfolio project.
