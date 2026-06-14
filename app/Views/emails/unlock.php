<?php
/**
 * @var string $nama
 * @var string $unlockUrl
 */
$brand = '#00F5B8';
?>
<p>Halo <strong><?= esc($nama ?? 'kamu') ?></strong>,</p>

<p>Akun MellogangVisuals kamu terkunci sementara karena 4x gagal login.
Tenang, kami kirim link untuk membuka kuncinya:</p>

<p style="text-align:center;margin:24px 0;">
  <a href="<?= esc($unlockUrl) ?>"
     style="background:<?= $brand ?>;color:#0A0E0D;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
    Buka Kunci Akun
  </a>
</p>

<p>Link ini berlaku 30 menit. Setelah dibuka, coba login lagi dengan sandi yang benar.</p>

<p>Kalau kamu merasa tidak mencoba login, segera ubah kata sandi setelah masuk.</p>
