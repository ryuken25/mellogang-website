<?= $this->extend('layout/admin') ?>

<?= $this->section('adminContent') ?>

<?php $isEn = \App\Support\I18n::isEn(); ?>

<div class="admin-hero">
  <div>
    <div class="admin-hero__chip"><?= $isEn ? 'Finance' : 'Keuangan' ?></div>
    <h1 class="admin-hero__title"><?= $isEn ? 'Payments' : 'Pembayaran' ?></h1>
    <p class="admin-hero__sub"><?= $isEn ? 'Review and verify every payment proof uploaded by customers.' : 'Tinjau dan verifikasi setiap bukti pembayaran yang diunggah pelanggan.' ?></p>
  </div>
</div>

<?php if (session()->getFlashdata('success')): ?>
  <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('error')): ?>
  <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
<?php endif; ?>

<div class="panel">
  <form method="get" style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px;">
    <select class="input" name="status" style="max-width:240px;">
      <option value="all" <?= strtolower((string)($status ?? '')) === 'all' ? 'selected' : '' ?>><?= $isEn ? 'All' : 'Semua' ?></option>
      <option value="menunggu" <?= strtolower((string)($status ?? '')) === 'menunggu' ? 'selected' : '' ?>><?= $isEn ? 'Pending' : 'Menunggu' ?></option>
      <option value="valid" <?= strtolower((string)($status ?? '')) === 'valid' ? 'selected' : '' ?>><?= $isEn ? 'Valid' : 'Valid' ?></option>
      <option value="ditolak" <?= strtolower((string)($status ?? '')) === 'ditolak' ? 'selected' : '' ?>><?= $isEn ? 'Rejected' : 'Ditolak' ?></option>
    </select>
    <button class="btn btn-primary" type="submit"><?= $isEn ? 'Filter' : 'Filter' ?></button>
    <a class="btnGhost" href="<?= site_url('admin/pembayaran') ?>"><?= $isEn ? 'Reset' : 'Reset' ?></a>
  </form>
</div>

<div class="panel" style="padding:0;overflow:hidden;">
  <div style="overflow-x:auto;">
    <table class="table" style="margin:0;">
      <thead>
        <tr>
          <th style="width:140px;"><?= $isEn ? 'Code' : 'Kode' ?></th>
          <th style="min-width:160px;"><?= $isEn ? 'Customer' : 'Pelanggan' ?></th>
          <th style="width:110px;"><?= $isEn ? 'Type' : 'Jenis' ?></th>
          <th style="width:160px;"><?= $isEn ? 'Date' : 'Tanggal' ?></th>
          <th style="width:140px;"><?= $isEn ? 'Method' : 'Metode' ?></th>
          <th style="width:150px;text-align:right;"><?= $isEn ? 'Amount' : 'Jumlah' ?></th>
          <th style="width:120px;"><?= $isEn ? 'Status' : 'Status' ?></th>
          <th style="width:170px;"><?= $isEn ? 'Proof' : 'Bukti' ?></th>
          <th style="width:110px;"><?= $isEn ? 'Action' : 'Aksi' ?></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
          <tr><td colspan="9" style="text-align:center;padding:30px;color:var(--muted);"><?= $isEn ? 'No payments yet.' : 'Belum ada pembayaran.' ?></td></tr>
        <?php else: ?>
          <?php foreach ($rows as $r):
            $st = strtolower((string)($r['status_verifikasi'] ?? ''));
            $stColor = match ($st) {
              'valid' => 'ok',
              'menunggu' => 'warn',
              'ditolak' => 'danger',
              default => 'muted',
            };
            $stLabel = match ($st) {
              'valid' => 'Valid',
              'menunggu' => 'Pending',
              'ditolak' => 'Rejected',
              default => ucfirst($st),
            };
          ?>
            <tr>
              <td style="font-family:'Space Grotesk',monospace;font-size:12px;"><?= esc($r['kode_pemesanan'] ?? '-') ?></td>
              <td><?= esc($r['nama_lengkap'] ?? '-') ?></td>
              <td><span class="pill"><?= esc($r['jenis_pembayaran'] ?? '-') ?></span></td>
              <td>
                <?php
                  $tgl = $r['tanggal_bayar'] ?? null;
                  echo $tgl ? esc(date('d/m/Y H:i', strtotime($tgl))) : '-';
                ?>
              </td>
              <td>
                <?= esc($r['metode_pembayaran'] ?? '-') ?>
                <?php if (($r['gateway'] ?? 'manual') === 'midtrans'): ?>
                  <span class="pill" style="background:rgba(0,245,184,.15);" title="<?= esc($r['transaction_status'] ?? '') ?>">Midtrans<?= !empty($r['payment_type']) ? ' · '.esc($r['payment_type']) : '' ?></span>
                <?php endif; ?>
              </td>
              <td style="text-align:right;font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--brand);">Rp <?= number_format((int)($r['jumlah_bayar'] ?? 0), 0, ',', '.') ?></td>
              <td><span class="pill status-<?= $stColor ?>"><?= $stLabel ?></span></td>
              <td>
                <?php if (! empty($r['bukti_bayar'])): ?>
                  <a class="link" target="_blank" rel="noopener" href="<?= site_url('admin/pembayaran/file/'.$r['id_pembayaran']) ?>"><?= $isEn ? 'Preview' : 'Preview' ?></a>
                  <span class="muted">·</span>
                  <a class="link" href="<?= site_url('admin/pembayaran/file/'.$r['id_pembayaran'].'?download=1') ?>"><?= $isEn ? 'Download' : 'Download' ?></a>
                <?php else: ?>
                  <span class="muted">—</span>
                <?php endif; ?>
              </td>
              <td>
                <a class="btnGhost" style="padding:4px 10px;font-size:12px;" href="<?= site_url('admin/pembayaran/verify/'.$r['id_pembayaran']) ?>"><?= $isEn ? 'Verify' : 'Verifikasi' ?></a>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?= $this->endSection() ?>
