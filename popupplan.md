# Goal Description

Memperbarui desain pop-up notifikasi tugas pada Dashboard Editor agar sesuai dengan referensi *design* [popup.png](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/popup.png) (header putih bersih, tab navigasi berbentuk *solid block*, dan *list* tugas dengan tombol aksi di sebelah kanan). Selain itu, memperbaiki *script* pemicu (trigger) pop-up agar modal dipastikan selalu muncul secara otomatis ketika editor *login* atau memencet menu dashboard.

## Proposed Changes

### Frontend / Views

#### [MODIFY] index.php (file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Views/editor/dashboard/index.php)
- Mengubah struktur HTML pada `<div id="tugasModal">`:
  - Mengganti *header* modal menjadi warna latar putih dengan teks hitam tebal ("Pengumuman" atau "Notifikasi Tugas") dan ikon *close* (x) agar mirip [popup.png](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/popup.png).
  - Mengganti desain *Tab Navigation* (Sedang Berlangsung & Mendatang) menjadi bentuk *solid block* (seperti tab berwarna biru pada referensi, tapi disesuaikan dengan warna *primary* aplikasi).
  - Merombak desain kartu tugas di dalam *body* modal agar lebih bersih (menampilkan judul kode, deksripsi, dan tombol aksi "Lihat Progres" yang tebal/jelas di sisi kanan, mirip tombol "Download" di [popup.png](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/popup.png)).
- Memperbarui kumpulan tag `<style>` untuk menyesuaikan perubahan elemen *tab* dan *button*.

#### [MODIFY] main.php (file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/app/Views/layout/main.php)
- Memperbaiki *script* Javascript otomatisasi *auto-show* modal di ujung *file*.
- Mengganti logika *trigger* agar lebih tangguh (menggunakan `bootstrap.Modal.getOrCreateInstance(el).show()`) dan dieksekusi setelah semua *resource* halaman beserta *script* Bootstrap dimuat sepenuhnya (`window.addEventListener('load', ...)`), sehingga memperbaiki *bug* "belum mau muncul".

## Verification Plan

### Automated / Manual Tests
- **Manual Verification**: Lakukan *login* dengan akun Editor, kemudian amati apakah pop-up notifikasi langsung muncul di layar tanpa memencet apa pun.
- **Manual Verification**: Pindah ke menu lain (contoh: Proyek Saya), lalu klik kembali menu **Dashboard**. Pastikan pop-up tugas muncul kembali secara otomatis.
- **Manual Verification**: Cek secara visual desain pop-up. Pastikan struktur tabel/kartu sesuai dengan rancangan referensi [popup.png](file:///c:/Project/Ngoding/Python/BOTS/Solo%20coding/skripshit/revisimellogang/popup.png) (terdiri atas Header, Tab aktif tertutup warna penuh, dan tombol aksi sejajar). Tes klik antar-tab ("Sedang Berlangsung" dan "Mendatang") untuk memastikan datanya berganti memunculkan *list* tugas berbeda dengan benar.
