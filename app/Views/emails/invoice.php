<?php
/**
 * @var string $nama
 * @var array  $order
 * @var string $kode
 * @var int    $total
 * @var int    $valid
 * @var int    $sisa
 * @var string $statusUrl
 * @var string $invoiceNo
 */
$brand = '#00F5B8';
$rupiah = static fn(int $n) => 'Rp ' . number_format($n, 0, ',', '.');
?>
<p>Halo <strong><?= esc($nama ?? 'kamu') ?></strong>,</p>

<p>Terima kasih sudah memesan layanan MellogangVisuals. Berikut ringkasan pesanan kamu:</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0E1413;border:1px solid #20302C;border-radius:12px;margin:16px 0;">
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;color:#8FA39D;font-size:12px;">Kode Pemesanan</td>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;text-align:right;font-weight:700;"><?= esc($kode) ?></td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;color:#8FA39D;font-size:12px;">Paket</td>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;text-align:right;"><?= esc($order['nama_paket'] ?? '-') ?></td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;color:#8FA39D;font-size:12px;">Tanggal Acara</td>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;text-align:right;"><?= esc($order['tanggal_acara'] ?? '-') ?></td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;color:#8FA39D;font-size:12px;">Total Tagihan</td>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;text-align:right;font-weight:700;"><?= $rupiah($total) ?></td>
  </tr>
  <tr>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;color:#8FA39D;font-size:12px;">Sudah Dibayar</td>
    <td style="padding:14px 18px;border-bottom:1px solid #20302C;text-align:right;color:<?= $brand ?>;"><?= $rupiah($valid) ?></td>
  </tr>
  <tr>
    <td style="padding:14px 18px;color:#8FA39D;font-size:12px;">Sisa</td>
    <td style="padding:14px 18px;text-align:right;font-weight:700;"><?= $rupiah($sisa) ?></td>
  </tr>
</table>

<p>
  Invoice lengkap (PDF) terlampir di email ini.
  Cek status pesanan kapan saja:
</p>

<p style="text-align:center;margin:24px 0;">
  <a href="<?= esc($statusUrl) ?>"
     style="background:<?= $brand ?>;color:#0A0E0D;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;display:inline-block;">
    Lihat Status Pesanan
  </a>
</p>
