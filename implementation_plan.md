# Implementation Plan: Revisi Sistem Informasi Manajemen Pemesanan

Rencana implementasi ini mencakup 3 poin revisi yang diminta, dengan detail teknis perubahan pada _controllers_ dan _views_ terkait.

## 1. Pop-up Notifikasi Tugas (Editor)
**Tujuan**: Menampilkan modal pop-up berisi daftar tugas hari ini dan mendatang saat Editor pertama kali login.

**Rencana Perubahan**:
- **[app/Controllers/AuthController.php](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/AuthController.php)**: 
  Tambahkan `session()->setFlashdata('show_tugas_popup', true);` ketika user yang login memiliki role `editor`. Flashdata digunakan agar pop-up hanya muncul 1x setelah login (hilang saat di-refresh).
- **[app/Controllers/Editor/DashboardController.php](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Editor/DashboardController.php)**: 
  Ambil data tugas khusus untuk **hari ini dan mendatang** (berdasarkan rentang `tanggal_mulai_editing` sampai `tanggal_selesai_editing`).
  - **Filter**: Kecualikan tugas yang berstatus `done` dan `revisi selesai`.
  - **Sorting**: Urutkan dengan metode FCFS (First Come First Served) berdasarkan _deadline_ (`tanggal_selesai_editing` secara ASCENDING).
  - Kirimkan data hasil query ini ke view `editor/dashboard/index`.
- **[app/Views/editor/dashboard/index.php](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Views/editor/dashboard/index.php)**: 
  Tambahkan komponen HTML Modal (menggunakan Bootstrap yang sudah ada). Tambahkan script Javascript sederhana: `if (<?= session()->getFlashdata('show_tugas_popup') ? 'true' : 'false' ?>) { $('#tugasModal').modal('show'); }`.

## 2. Otomatisasi Batas Waktu Pembayaran
**Tujuan**: Otomatisasi pembatalan pesanan jika belum dibayar dlam 2 jam, dan perbaikan logika availability (ketersediaan 2 fotografer per hari) agar pesanan yang belum dibayar tapi masih dalam 2 jam tetap mem-booking kuota.

**Rencana Perubahan**:
- **Logika Ketersediaan ([availability](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Pelanggan/PemesananController.php#46-79))**:
  Saat ini `PemesananController::availability` (baik di Admin maupun Pelanggan) hanya menghitung dari tabel `jadwal_produksi`. Padahal `jadwal_produksi` baru dibuat Admin **setelah** ada pembayaran valid.
  - _Solusi_: Ubah query [availability](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Pelanggan/PemesananController.php#46-79) agar menghitung jumlah pesanan aktif dari tabel `pemesanan` (dengan `tanggal_acara` = tanggal yang dipilih, dan `status_pemesanan` BUKAN `batal` / `ditolak`).
  - *Modifikasi File*: [app/Controllers/Pelanggan/PemesananController.php](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Pelanggan/PemesananController.php) dan [app/Controllers/Admin/JadwalProduksiController.php](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Admin/JadwalProduksiController.php).
- **Lazy Check Pembatalan 2 Jam**:
  Karena menggunakan _lazy check_ lebih efisien daripada _cron job_ pada level ini, logika pengecekan 2 jam akan dijalankan tepat sebelum melakukan query availability di endpoint [availability()](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Pelanggan/PemesananController.php#46-79).
  - _Query Update_: `UPDATE pemesanan SET status_pemesanan = 'batal' WHERE status_pemesanan = 'menunggu pembayaran' AND tanggal_pemesanan <= DATE_SUB(NOW(), INTERVAL 2 HOUR)`
  - Dengan cara ini, jadwal yang batas bayarnya expired (>2 jam) akan langsung jadi 'batal' dan otomatis melepas kuota ketersediaan harinya.

## 3. Sinkronisasi Status 'Done'
**Tujuan**: Menambahkan perhitungan status `revisi selesai` ke dalam kolom D (hitungan Done) di Dashboard Editor.

**Rencana Perubahan**:
- **[app/Controllers/Editor/DashboardController.php](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Controllers/Editor/DashboardController.php)**:
  Saat ini kode menghitung variabel `$countD` hanya dari status `done`.
  ```php
  $countD = $this->countByStatus($db, $idEditor, 'done');
  ```
  Akan diubah menjadi:
  ```php
  $countD_done = $this->countByStatus($db, $idEditor, 'done');
  $countD_revisi = $this->countByStatus($db, $idEditor, 'revisi selesai');
  $countD = $countD_done + $countD_revisi;
  ```
  Ini akan secara langsung menyinkronisasikan perhitungan tampilan awal (Kolom A-D) dengan status 'Done' dan 'Revisi Selesai'.

---
## Verification Plan
1. **Pop-up Notifikasi**: Login sebagai editor, pastikan pop-up muncul memuat tugas. Refresh halaman, pastikan pop-up tidak muncul lagi.
2. **Otomatisasi Batas Waktu**: Login sebagai pelanggan, buat pemesanan (menunggu pembayaran). Cek availability via calendar/endpoint untuk tanggal tersebut (kuota harus berkurang). Lalu ubah `tanggal_pemesanan` menjadi 3 jam yang lalu via manipulasi database sementara, dan cek availability kembali. Pesanan tadi harus otomatis batal dan kuota kembali utuh.
3. **Sinkronisasi Status Done**: Di dashboard editor, cek total angka `Done`. Buka tugas yang ada di tahap revisi, selesaikan revisi menjadi `revisi selesai`. Kembali ke dashboard awal dan pastikan angka di kolom D bertambah 1.
