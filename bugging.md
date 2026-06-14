# bugging.md — Laporan Bug & Review Revisi

Tanggal review: 2026-03-26

---

## Status Revisi

| Revisi | Status | Catatan |
|--------|--------|---------|
| **1 — Pop-up Notifikasi Tugas** | ⚠️ PASS — ada 1 critical bug | Logika benar, tapi `whereNotIn()` dengan `LOWER()` tidak bekerja di CI4 |
| **2 — Otomatisasi Batas Waktu Pembayaran** | ✅ PASS | Lazy check & availability query benar di kedua controller |
| **3 — Sinkronisasi Status Done** | ✅ PASS | `countD = done + revisi selesai` sudah benar |

---

## Bug yang Ditemukan

---

### BUG #1 — whereNotIn() dengan LOWER() tidak valid di CodeIgniter 4
**Severity:** 🔴 CRITICAL
**File:** `app/Controllers/Editor/DashboardController.php`
**Baris:** ~75 (query `$tugasPopup`)

**Kode bermasalah:**
```php
->whereNotIn('LOWER(j.status_produksi)', ['done', 'revisi selesai'])
```

**Masalah:**
`whereNotIn()` di CodeIgniter 4 mengharapkan nama kolom biasa sebagai parameter pertama, bukan ekspresi SQL mentah. Ketika diisi `'LOWER(j.status_produksi)'`, CI4 akan meng-quote string itu sebagai nama kolom:
```sql
-- Yang di-generate CI4 (SALAH):
WHERE `LOWER(j.status_produksi)` NOT IN ('done', 'revisi selesai')
-- Query error atau tidak memfilter sama sekali
```

**Dampak:**
Pop-up akan menampilkan SEMUA tugas termasuk yang sudah `done` dan `revisi selesai`, tidak sesuai rencana.

**Fix:**
```php
// Ganti whereNotIn() dengan where() raw:
->where("LOWER(j.status_produksi) NOT IN ('done', 'revisi selesai')", null, false)
```

---

### BUG #2 — SQL Injection risk: variabel langsung di-embed ke string SQL
**Severity:** 🟡 MEDIUM
**File:** `app/Controllers/Admin/PembayaranController.php`
**Baris:** ~30

**Kode bermasalah:**
```php
$q->where("LOWER(p.status_verifikasi) = '{$st}'", null, false);
```

**Masalah:**
Variabel `$st` di-embed langsung ke string SQL tanpa escaping. Meski saat ini `$st` berasal dari `strtolower()` atas input yang sudah dinormalisasi, pola ini tetap rentan jika kode berubah di masa depan.

**Fix:**
```php
$q->where("LOWER(p.status_verifikasi) = " . $db->escape($st), null, false);
```

---

### BUG #3 — SQL Injection risk: variabel langsung di-embed ke string SQL
**Severity:** 🟡 MEDIUM
**File:** `app/Controllers/Editor/TugasController.php`
**Baris:** ~114

**Kode bermasalah:**
```php
$q->where("LOWER(j.status_produksi) = '{$status}'", null, false);
```

**Masalah:**
Sama dengan Bug #2. `$status` berasal dari query string `?status=...` (user input), hanya dinormalisasi lewat `norm()`. Rentan SQL injection.

**Fix:**
```php
$q->where("LOWER(j.status_produksi) = " . $db->escape($status), null, false);
```

---

### BUG #4 — where() dengan LOWER() bekerja secara tidak sengaja
**Severity:** 🟡 MEDIUM
**File:** `app/Controllers/Admin/PemesananController.php`
**Baris:** ~106

**Kode bermasalah:**
```php
->where('LOWER(status_verifikasi)', 'valid')
```

**Masalah:**
CI4 akan menginterpretasikan `'LOWER(status_verifikasi)'` sebagai nama kolom dan menghasilkan:
```sql
WHERE `LOWER(status_verifikasi)` = 'valid'
```
Query ini bekerja di beberapa versi MySQL secara kebetulan (tergantung mode SQL), tapi secara teknis tidak benar.

**Fix:**
```php
->where("LOWER(status_verifikasi) = " . $db->escape('valid'), null, false)
// atau kalau DB sudah case-insensitive:
->where('status_verifikasi', 'valid')
```

---

### BUG #5 — where() dengan LOWER() bekerja secara tidak sengaja (duplikat pola)
**Severity:** 🟡 MEDIUM
**File:** `app/Controllers/Public/StatusController.php`
**Baris:** ~428

**Kode bermasalah:**
```php
->where('LOWER(status_verifikasi)', 'valid')
```

**Masalah:** Sama dengan Bug #4.

**Fix:** Sama dengan Bug #4.

---

## Catatan Tambahan

- **Modal JS sudah benar**: Implementasi menggunakan `new bootstrap.Modal()` (Bootstrap 5 API), bukan jQuery `$('#id').modal()` (Bootstrap 4). Ini lebih baik dari contoh di implementation plan.
- **Revision 2 (availability)**: `whereNotIn('status_pemesanan', ['batal', 'ditolak'])` di kedua controller **sudah benar** karena menggunakan nama kolom biasa tanpa LOWER(), tidak seperti Bug #1.
- **Lazy check UPDATE query** di Revision 2 sudah tepat dan identik di kedua controller.

---

## Prioritas Fix

| Prioritas | Bug | File |
|-----------|-----|------|
| 🔴 Harus segera | Bug #1 — whereNotIn LOWER() | Editor/DashboardController.php |
| 🟡 Sebaiknya diperbaiki | Bug #2 — SQL injection risk | Admin/PembayaranController.php |
| 🟡 Sebaiknya diperbaiki | Bug #3 — SQL injection risk | Editor/TugasController.php |
| 🟡 Kode quality | Bug #4 | Admin/PemesananController.php |
| 🟡 Kode quality | Bug #5 | Public/StatusController.php |
