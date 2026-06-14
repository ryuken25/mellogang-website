# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**MellogangVisuals Ordering & Production Tracking System** — A CodeIgniter 4 web app for managing photo/video service orders, payment verification, and editor production tracking with role-based access (admin, editor, pelanggan/customer).

## Commands

```bash
# Install dependencies
composer install

# Start dev server (http://localhost:8080)
php spark serve --port 8080

# Run database migrations
php spark migrate

# Seed sample data
php spark db:seed DatabaseSeeder

# Run tests
composer test
# or
./vendor/bin/phpunit
```

## Architecture

**Framework**: CodeIgniter 4 (PHP 8.1+), MySQL, Bootstrap 5 + jQuery. Controllers use CodeIgniter's Query Builder directly — no Eloquent/ORM.

### Role-Based Controllers

Three namespaced controller groups map to three user roles:

| Role | Namespace | Routes prefix |
|------|-----------|---------------|
| Admin | `App\Controllers\Admin\` | `/admin` |
| Editor | `App\Controllers\Editor\` | `/editor` |
| Pelanggan | `App\Controllers\Pelanggan\` | `/pelanggan` |
| Public | `App\Controllers\Public\` | `/` |

`AuthController.php` handles login/logout/register and sets session with `user_id`, `user_role`, and `user_nama`.

### Key Data Flow

1. **Order lifecycle**: Customer creates order (`pemesanan`) → uploads payment proof (`pembayaran`) → Admin verifies → Admin creates production schedule (`jadwal_produksi`) → Editor updates status through stages.

2. **Production status flow**:
   ```
   pra produksi → shooting → cut-to-cut → finishing → done
                                    ↓
                                 revisi → revisi selesai
   ```

3. **Availability check** (important for revisions): Both `Pelanggan/PemesananController` and `Admin/JadwalProduksiController` expose AJAX endpoints to check remaining photographer capacity (max 2 per day) for a given date.

### Critical Tables

- `pemesanan` — Orders. Key fields: `kode_pemesanan` (MLG+YYMMDD+4rand), `tanggal_acara`, `tanggal_pemesanan`, `status_pemesanan`
- `jadwal_produksi` — Production schedules. Key fields: `status_produksi`, `tanggal_shooting`, `tanggal_selesai_editing`, `revisi_count`, `id_editor`
- `pembayaran` — Payments. Key fields: `jenis_pembayaran` (DP/pelunasan), `status_verifikasi`

### Implementation Plan (Pending Revisions)

See `implementation_plan.md` for the 3 active revisions:

1. **Pop-up Tugas (Editor login modal)** — On editor login, `AuthController` sets flashdata `show_tugas_popup`. `Editor/DashboardController` queries today's + future incomplete tasks ordered by `tanggal_selesai_editing` ASC (FCFS). View `editor/dashboard/index.php` shows Bootstrap modal on page load.

2. **Otomatisasi Pembayaran (2-hour auto-cancel + availability fix)** — Before any availability query, run a lazy `UPDATE pemesanan SET status_pemesanan='batal' WHERE status_pemesanan='menunggu pembayaran' AND tanggal_pemesanan <= DATE_SUB(NOW(), INTERVAL 2 HOUR)`. Fix availability to count from `pemesanan` (not `jadwal_produksi`) excluding `batal`/`ditolak` statuses.

3. **Sinkronisasi Status Done** — In `Editor/DashboardController::countD`, sum both `done` and `revisi selesai` statuses instead of only `done`.

## Demo Accounts

All passwords: `123123`
- Admin: `admin@mellogang.test`
- Editor: `editor1@mellogang.test`
- Customer: `pengguna1@mellogang.test`

## File Upload Paths

- Payment proofs: `writable/uploads/pembayaran/`
- Avatars: `writable/uploads/avatars/`
- Portfolio: `public/uploads/portofolio/`
