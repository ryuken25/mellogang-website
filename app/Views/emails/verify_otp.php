<?php
/**
 * @var string $nama
 * @var string $otp
 * @var string $verifyUrl
 * @var string $kode_pemesanan optional
 */
$brand = '#00F5B8';
?>
<p>Halo <strong><?= esc($nama ?? 'kamu') ?></strong>,</p>

<p>Berikut kode verifikasi untuk akun MellogangVisuals kamu:</p>

<div style="background:#0E1413;border:2px dashed <?= $brand ?>;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
  <div style="font-size:36px;font-weight:800;letter-spacing:0.2em;color:<?= $brand ?>;font-family:'Space Grotesk',Inter,Arial,sans-serif;">
    <?= esc($otp) ?>
  </div>
  <div style="color:#8FA39D;font-size:12px;margin-top:8px;">Berlaku 15 menit</div>
</div>

<p>Atau klik tombol ini untuk verifikasi otomatis:</p>

<p style="text-align:center;margin:24px 0;">
  <a href="<?= esc($verifyUrl) ?>"
     style="background:<?= $brand ?>;color:#0A0E0D;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
    Verifikasi Akun
  </a>
</p>

<p>Kalau kamu merasa tidak meminta email ini, abaikan saja.</p>
