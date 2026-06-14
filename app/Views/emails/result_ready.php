<?php
/**
 * @var string $nama
 * @var string $kode
 * @var string $linkDrive
 * @var string $namaPaket
 */
$brand = '#00F5B8';
?>
<p>Halo <strong><?= esc($nama ?? 'kamu') ?></strong>,</p>

<p>Kabar baik! Hasil untuk pesanan <strong><?= esc($kode) ?></strong>
(<?= esc($namaPaket ?? 'layanan kamu') ?>) sudah siap di-drive kami.</p>

<p>Silakan unduh hasilnya lewat link di bawah ini. Pastikan kamu login ke
akun Google yang kamu pakai, atau minta akses "Siapa saja dengan link — Pelihat"
ke admin kalau belum bisa dibuka.</p>

<p style="text-align:center;margin:24px 0;">
  <a href="<?= esc($linkDrive) ?>"
     style="background:<?= $brand ?>;color:#0A0E0D;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
    Unduh Hasil
  </a>
</p>

<p style="word-break:break-all;color:#8FA39D;font-size:13px;">
  Atau salin link ini: <br>
  <span style="color:<?= $brand ?>;"><?= esc($linkDrive) ?></span>
</p>

<p>Kalau ada revisi yang perlu dilakukan, balas email ini atau gunakan tombol
"Revisi" di halaman status pesanan. Batas revisi 2x ya.</p>

<p>Terima kasih sudah mempercayakan momen kamu ke MellogangVisuals!</p>
