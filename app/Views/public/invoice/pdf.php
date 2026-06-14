<?php
/**
 * Invoice PDF — view untuk Dompdf.
 *
 * @var array  $order
 * @var array  $validPays
 * @var int    $totalOrder
 * @var int    $totalValid
 * @var int    $sisa
 * @var string $invoiceNo
 * @var string $issuedAt
 * @var Closure $rupiah
 */
?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Invoice <?= esc($invoiceNo) ?></title>
<style>
  @page { margin: 24px 28px; }
  body { font-family: DejaVu Sans, Helvetica, Arial, sans-serif; color:#111; font-size:12px; }
  h1 { color:#0A0E0D; font-size:22px; margin:0; }
  .brand { color:#00B98B; font-weight:800; letter-spacing:0.05em; font-size:13px; text-transform:uppercase; }
  .row { display:block; overflow:hidden; }
  .col { float:left; width:50%; }
  table { width:100%; border-collapse:collapse; margin-top:14px; }
  th, td { padding:8px 10px; text-align:left; border-bottom:1px solid #e5e7eb; }
  th { background:#f3f6f8; font-size:11px; text-transform:uppercase; color:#64748b; }
  .right { text-align:right; }
  .totals td { font-weight:bold; }
  .pill { display:inline-block; padding:2px 8px; border-radius:10px; background:#ecfdf5; color:#0f766e; font-size:11px; }
  .meta { color:#64748b; font-size:11px; }
</style>
</head>
<body>

<div class="row">
  <div class="col">
    <div class="brand">Mellogang Visuals</div>
    <h1>Invoice</h1>
    <div class="meta">No: <?= esc($invoiceNo) ?></div>
    <div class="meta">Tanggal: <?= esc($issuedAt) ?></div>
  </div>
  <div class="col right">
    <div style="font-weight:700;font-size:14px;">Ditagihkan ke:</div>
    <div><?= esc($order['nama_lengkap'] ?? '-') ?></div>
    <div><?= esc($order['email'] ?? '-') ?></div>
    <div><?= esc($order['no_telepon'] ?? '-') ?></div>
  </div>
</div>

<div style="height:14px;"></div>

<table>
  <tr>
    <th style="width:30%;">Kode Pemesanan</th>
    <td><?= esc($order['kode_pemesanan'] ?? '-') ?></td>
  </tr>
  <tr>
    <th>Paket</th>
    <td><?= esc($order['nama_paket'] ?? '-') ?></td>
  </tr>
  <tr>
    <th>Tanggal Acara</th>
    <td><?= esc($order['tanggal_acara'] ?? '-') ?>, <?= esc($order['jam_mulai_acara'] ?? '-') ?></td>
  </tr>
  <tr>
    <th>Lokasi</th>
    <td><?= esc($order['lokasi_acara'] ?? '-') ?></td>
  </tr>
</table>

<table>
  <thead>
    <tr>
      <th>Tanggal</th>
      <th>Jenis</th>
      <th>Metode</th>
      <th class="right">Jumlah</th>
    </tr>
  </thead>
  <tbody>
    <?php foreach ($validPays as $p): ?>
      <tr>
        <td><?= esc($p['tanggal_bayar'] ?? '-') ?></td>
        <td><?= esc($p['jenis_pembayaran'] ?? '-') ?></td>
        <td><?= esc($p['metode_pembayaran'] ?? '-') ?></td>
        <td class="right"><?= $rupiah((int)($p['jumlah_bayar'] ?? 0)) ?></td>
      </tr>
    <?php endforeach; ?>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3" class="right">Total Tagihan</td>
      <td class="right"><?= $rupiah($totalOrder) ?></td>
    </tr>
    <tr>
      <td colspan="3" class="right">Sudah Dibayar</td>
      <td class="right"><?= $rupiah($totalValid) ?></td>
    </tr>
    <tr class="totals">
      <td colspan="3" class="right">Sisa</td>
      <td class="right"><?= $rupiah($sisa) ?></td>
    </tr>
  </tfoot>
</table>

<p class="meta" style="margin-top:30px;">
  Invoice ini dihasilkan otomatis oleh sistem MellogangVisuals. Simpan sebagai bukti pembayaran.
  Status pesanan dapat dilihat di: <?= esc(site_url('status-pesanan?kode=' . urlencode((string)($order['kode_pemesanan'] ?? '')))) ?>
</p>

</body>
</html>
