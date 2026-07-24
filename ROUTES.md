# ROUTES.md — Peta Route Backend (CI4)

Digenerate dari `php spark routes` — 2026-07-25. Regenerate: `php spark routes`.

Filter global: `csrf` (semua POST kecuali login/register), `appsec` (after).
Filter terpusat via `Filters::$filters`: role:admin (admin/*), role:editor (editor/*), role:pelanggan (pelanggan/*), cors (api/*).

| Method | Path | Controller | Before Filters |
|--------|------|-----------|----------------|
| GET | `/` | Public\HomeController::index | csrf |
| GET | `/profile` | ProfileController::index | csrf |
| GET | `/profile/avatar` | ProfileController::avatar | csrf |
| GET | `/login` | AuthController::loginForm | — |
| GET | `/register` | AuthController::registerForm | — |
| GET | `/logout` | AuthController::logout | csrf |
| GET | `/showcase` | Public\ShowcaseController::index | csrf |
| GET | `/lang/:segment` | BaseController::setLanguage/$1 | csrf |
| GET | `/auth/verify` | AuthController::verifyForm | csrf |
| GET | `/auth/verify-link` | AuthController::verifyLink | csrf |
| GET | `/auth/unlock` | AuthController::unlock | csrf |
| GET | `/auth/unlock/:any` | AuthController::unlock/$1 | csrf |
| GET | `/auth/google/redirect` | AuthController::googleRedirect | csrf |
| GET | `/auth/google/callback` | AuthController::googleCallback | csrf |
| GET | `/katalog` | Public\KatalogController::index | csrf |
| GET | `/portofolio` | Public\PortofolioController::index | csrf |
| GET | `/kontak` | Public\KontakController::index | csrf |
| GET | `/api/packages` | Api\PublicApiController::packages | csrf cors |
| GET | `/api/portfolio` | Api\PublicApiController::portfolio | csrf cors |
| GET | `/api/brand` | Api\PublicApiController::brand | csrf cors |
| GET | `/api/order-status` | Api\PublicApiController::orderStatus | csrf cors |
| GET | `/api/dashboard/admin-summary` | Api\DashboardApiController::adminSummary | csrf cors role:admin |
| GET | `/status-pesanan` | Public\StatusController::index | csrf |
| GET | `/status-pesanan/file/:num/:segment` | Public\StatusController::file/$1/$2 | csrf |
| GET | `/invoice/:segment` | Public\InvoiceController::show/$1 | csrf |
| GET | `/pelanggan` | Pelanggan\DashboardController::index | csrf role:pelanggan |
| GET | `/pelanggan/dashboard` | Pelanggan\DashboardController::index | csrf role:pelanggan |
| GET | `/pelanggan/pemesanan/buat` | Pelanggan\PemesananController::create | csrf role:pelanggan |
| GET | `/pelanggan/pemesanan/buat/:num` | Pelanggan\PemesananController::create/$1 | csrf role:pelanggan |
| GET | `/pelanggan/pemesanan/availability` | Pelanggan\PemesananController::availability | csrf role:pelanggan |
| GET | `/pelanggan/pembayaran/upload/:num` | Pelanggan\PembayaranController::create/$1 | csrf role:pelanggan |
| GET | `/pelanggan/pembayaran/ganti/:num` | Pelanggan\PembayaranController::edit/$1 | csrf role:pelanggan |
| GET | `/pelanggan/pembayaran/riwayat/:num` | Pelanggan\PembayaranController::riwayat/$1 | csrf role:pelanggan |
| GET | `/pelanggan/pembayaran/file/:num` | Pelanggan\PembayaranController::file/$1 | csrf role:pelanggan |
| GET | `/pelanggan/pembayaran/:num/status` | Pelanggan\PembayaranController::status/$1 | csrf role:pelanggan |
| POST | `/pelanggan/pembayaran/:num/snap-token` | Pelanggan\PembayaranController::snapToken/$1 | csrf role:pelanggan |
| POST | `/payment/midtrans/notify` | PaymentWebhookController::notify | — (CSRF exempt; verifikasi signature sha512) |
| GET | `/admin` | Admin\DashboardController::index | csrf role:admin |
| GET | `/admin/paket` | Admin\PaketController::index | csrf role:admin |
| GET | `/admin/paket/create` | Admin\PaketController::create | csrf role:admin |
| GET | `/admin/paket/edit/:num` | Admin\PaketController::edit/$1 | csrf role:admin |
| GET | `/admin/portofolio` | Admin\PortofolioController::index | csrf role:admin |
| GET | `/admin/portofolio/create` | Admin\PortofolioController::create | csrf role:admin |
| GET | `/admin/portofolio/edit/:num` | Admin\PortofolioController::edit/$1 | csrf role:admin |
| GET | `/admin/pemesanan` | Admin\PemesananController::index | csrf role:admin |
| GET | `/admin/pemesanan/:num` | Admin\PemesananController::show/$1 | csrf role:admin |
| GET | `/admin/pemesanan/invoice/:num` | Admin\PemesananController::invoice/$1 | csrf role:admin |
| GET | `/admin/pembayaran` | Admin\PembayaranController::index | csrf role:admin |
| GET | `/admin/pembayaran/verify/:num` | Admin\PembayaranController::verifyForm/$1 | csrf role:admin |
| GET | `/admin/pembayaran/file/:num` | Admin\PembayaranController::file/$1 | csrf role:admin |
| GET | `/admin/jadwal` | Admin\JadwalProduksiController::index | csrf role:admin |
| GET | `/admin/jadwal/create` | Admin\JadwalProduksiController::create | csrf role:admin |
| GET | `/admin/jadwal/edit/:num` | Admin\JadwalProduksiController::edit/$1 | csrf role:admin |
| GET | `/admin/jadwal/availability` | Admin\JadwalProduksiController::availability | csrf role:admin |
| GET | `/admin/pengeluaran` | Admin\PengeluaranController::index | csrf role:admin |
| GET | `/admin/pengeluaran/create` | Admin\PengeluaranController::create | csrf role:admin |
| GET | `/admin/pengeluaran/edit/:num` | Admin\PengeluaranController::edit/$1 | csrf role:admin |
| GET | `/admin/laporan` | Admin\LaporanController::index | csrf role:admin |
| GET | `/admin/laporan/export/pembayaran` | Admin\LaporanController::exportPembayaran | csrf role:admin |
| GET | `/admin/laporan/export/pengeluaran` | Admin\LaporanController::exportPengeluaran | csrf role:admin |
| GET | `/admin/laporan/export/pembayaran-all` | Admin\LaporanController::exportPembayaranAll | csrf role:admin |
| GET | `/admin/laporan/export/pembayaran-pending` | Admin\LaporanController::exportPembayaranPending | csrf role:admin |
| GET | `/admin/laporan/export/pembayaran-valid` | Admin\LaporanController::exportPembayaranValid | csrf role:admin |
| GET | `/admin/social` | Admin\SocialController::index | csrf role:admin |
| GET | `/admin/social/status/:num` | Admin\SocialController::status/$1 | csrf role:admin |
| GET | `/admin/social/cache` | Admin\SocialController::cache | csrf role:admin |
| GET | `/admin/users` | Admin\UsersController::index | csrf role:admin |
| GET | `/admin/users/edit/:num` | Admin\UsersController::edit/$1 | csrf role:admin |
| GET | `/editor` | Editor\DashboardController::index | csrf role:editor |
| GET | `/editor/tugas` | Editor\TugasController::index | csrf role:editor |
| GET | `/editor/tugas/:num` | Editor\TugasController::show/$1 | csrf role:editor |
| GET | `/editor/tugas/file/:num/:segment` | Editor\TugasController::file/$1/$2 | csrf role:editor |
| POST | `/profile/update` | ProfileController::update | csrf |
| POST | `/profile/password` | ProfileController::password | csrf |
| POST | `/profile/photo` | ProfileController::photo | csrf |
| POST | `/login` | AuthController::login | — |
| POST | `/register` | AuthController::register | — |
| POST | `/auth/verify` | AuthController::verify | csrf |
| POST | `/auth/resend-otp` | AuthController::resendOtp | csrf |
| POST | `/status-pesanan/revisi/:num` | Public\StatusController::revisi/$1 | csrf |
| POST | `/status-pesanan/selesai/:num` | Public\StatusController::selesai/$1 | csrf |
| POST | `/pelanggan/pemesanan/simpan` | Pelanggan\PemesananController::store | csrf role:pelanggan |
| POST | `/pelanggan/pembayaran/upload/:num` | Pelanggan\PembayaranController::store/$1 | csrf role:pelanggan |
| POST | `/pelanggan/pembayaran/ganti/:num` | Pelanggan\PembayaranController::update/$1 | csrf role:pelanggan |
| POST | `/admin/paket` | Admin\PaketController::store | csrf role:admin |
| POST | `/admin/paket/update/:num` | Admin\PaketController::update/$1 | csrf role:admin |
| POST | `/admin/paket/delete/:num` | Admin\PaketController::delete/$1 | csrf role:admin |
| POST | `/admin/portofolio` | Admin\PortofolioController::store | csrf role:admin |
| POST | `/admin/portofolio/update/:num` | Admin\PortofolioController::update/$1 | csrf role:admin |
| POST | `/admin/portofolio/delete/:num` | Admin\PortofolioController::delete/$1 | csrf role:admin |
| POST | `/admin/pemesanan/delete/:num` | Admin\PemesananController::delete/$1 | csrf role:admin |
| POST | `/admin/pembayaran/verify/:num` | Admin\PembayaranController::verify/$1 | csrf role:admin |
| POST | `/admin/jadwal` | Admin\JadwalProduksiController::store | csrf role:admin |
| POST | `/admin/jadwal/update/:num` | Admin\JadwalProduksiController::update/$1 | csrf role:admin |
| POST | `/admin/pengeluaran` | Admin\PengeluaranController::store | csrf role:admin |
| POST | `/admin/pengeluaran/update/:num` | Admin\PengeluaranController::update/$1 | csrf role:admin |
| POST | `/admin/pengeluaran/delete/:num` | Admin\PengeluaranController::delete/$1 | csrf role:admin |
| POST | `/admin/laporan/pengeluaran` | Admin\LaporanController::storePengeluaran | csrf role:admin |
| POST | `/admin/laporan/pengeluaran/update/:num` | Admin\LaporanController::updatePengeluaran/$1 | csrf role:admin |
| POST | `/admin/laporan/pengeluaran/delete/:num` | Admin\LaporanController::deletePengeluaran/$1 | csrf role:admin |
| POST | `/admin/social/fetch` | Admin\SocialController::fetch | csrf role:admin |
| POST | `/admin/social/upsert` | Admin\SocialController::upsert | csrf role:admin |
| POST | `/admin/social/feature/:num` | Admin\SocialController::feature/$1 | csrf role:admin |
| POST | `/admin/users/update/:num` | Admin\UsersController::update/$1 | csrf role:admin |
| POST | `/admin/users/delete/:num` | Admin\UsersController::delete/$1 | csrf role:admin |
| POST | `/editor/tugas/update/:num` | Editor\TugasController::update/$1 | csrf role:editor |
| POST | `/editor/tugas/revisi/accept/:num` | Editor\TugasController::acceptRevisi/$1 | csrf role:editor |
| POST | `/editor/tugas/revisi/reject/:num` | Editor\TugasController::rejectRevisi/$1 | csrf role:editor |
| OPTIONS | `/api/:any` | (Closure) | csrf cors |

## Route Frontend (React, mellogang.vercel.app)

Dari `frontend/src/App.jsx` — SPA fallback via `frontend/vercel.json`:

| Path | Halaman | Catatan |
|------|---------|---------|
| / | Home | |
| /katalog | Katalog | |
| /portofolio | Portfolio | /portfolio redirect ke sini |
| /kontak | Kontak | |
| /status-pesanan, /status | StatusPesanan | |
| /invoice, /invoice/:kode | Invoice | protected |
| /profile, /profile/edit | Profile | protected |
| /pelanggan/dashboard | CustomerDashboard | protected; /pelanggan redirect |
| /pelanggan/pemesanan/buat/:packageId | CreateBooking | protected |
| /admin, /dashboard/admin | AdminDashboard | |
| /editor, /dashboard/editor | EditorDashboard | |
| /auth | Auth | /login & /register redirect ke sini |
| * | NotFound | SPA 404 |
