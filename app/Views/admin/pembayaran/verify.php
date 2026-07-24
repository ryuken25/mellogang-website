<?= $this->extend('layout/admin') ?>
<?= $this->section('adminContent') ?>

<div class="container">
  <h2 class="section__title">Verifikasi Pembayaran</h2>

  <?php if (session()->getFlashdata('success')): ?>
    <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
  <?php endif; ?>

  <?php if (session()->getFlashdata('error')): ?>
    <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
  <?php endif; ?>

  <div class="panel">
    <?php
      $isMidtrans   = ($row['gateway'] ?? 'manual') === 'midtrans';
      $stLower      = strtolower(trim((string)($row['status_verifikasi'] ?? '')));
      $lockMidtrans = $isMidtrans && $stLower === 'valid';
    ?>
    <div><b>Kode:</b> <?= esc($row['kode_pemesanan'] ?? '-') ?></div>
    <div><b>Pelanggan:</b> <?= esc($row['nama_lengkap'] ?? '-') ?></div>
    <div><b>Jenis:</b> <?= esc($row['jenis_pembayaran'] ?? '-') ?></div>
    <div><b>Jumlah:</b> Rp <?= number_format((int)($row['jumlah_bayar'] ?? 0), 0, ',', '.') ?></div>
    <div><b>Status:</b> <?= esc($row['status_verifikasi'] ?? '-') ?></div>
    <?php if ($isMidtrans): ?>
      <div><b>Gateway:</b> <span class="pill" style="background:rgba(0,245,184,.15);">Midtrans</span>
        <?= !empty($row['payment_type']) ? esc($row['payment_type']) : '' ?>
        <?= !empty($row['transaction_status']) ? '· '.esc($row['transaction_status']) : '' ?>
        <?= !empty($row['midtrans_order_id']) ? '· '.esc($row['midtrans_order_id']) : '' ?>
      </div>
    <?php endif; ?>

    <?php if (!empty($row['bukti_bayar'])): ?>
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:14px 0;">

      <div class="label" style="margin-bottom:6px;">Preview Bukti Bayar</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
        <a class="btnGhost" target="_blank" rel="noopener"
           href="<?= site_url('admin/pembayaran/file/'.$row['id_pembayaran']) ?>">
          Buka di tab baru
        </a>
        <a class="btnGhost"
           href="<?= site_url('admin/pembayaran/file/'.$row['id_pembayaran'].'?download=1') ?>">
          Download
        </a>
      </div>

      <div style="border:1px solid #e5e7eb;border-radius:12px;padding:10px;background:#fff;">
        <img
          src="<?= site_url('admin/pembayaran/file/'.$row['id_pembayaran']) ?>"
          alt="Bukti bayar"
          style="max-width:100%;height:auto;display:block;border-radius:10px;"
        >
      </div>
    <?php endif; ?>

    <hr style="border:0;border-top:1px solid #e5e7eb;margin:14px 0;">

    <?php if ($lockMidtrans): ?>
      <div class="alert ok">
        Pembayaran ini settle otomatis via Midtrans — <b>read-only</b>.
        Status final ditentukan webhook, tidak bisa diubah manual.
      </div>
      <a class="btnGhost" href="<?= site_url('admin/pembayaran') ?>" style="margin-top:10px;">Kembali</a>
    <?php else: ?>
    <form method="post" action="<?= site_url('admin/pembayaran/verify/'.$row['id_pembayaran']) ?>">
      <?= csrf_field() ?>

      <div class="row">
        <div>
          <div class="label">Status Verifikasi</div>
          <?php $st = strtolower(trim((string)($row['status_verifikasi'] ?? 'menunggu'))); ?>
          <select class="input" name="status_verifikasi" required>
            <option value="menunggu" <?= $st==='menunggu'?'selected':'' ?>>Menunggu</option>
            <option value="valid" <?= $st==='valid'?'selected':'' ?>>Valid</option>
            <option value="ditolak" <?= $st==='ditolak'?'selected':'' ?>>Ditolak</option>
          </select>
        </div>

        <div>
          <div class="label">Catatan Verifikasi</div>
          <input class="input" name="catatan_verifikasi" value="<?= esc($row['catatan_verifikasi'] ?? '') ?>">
        </div>
      </div>

      <button class="btnPrimary" type="submit" style="margin-top:10px;">Simpan</button>
      <a class="btnGhost" href="<?= site_url('admin/pembayaran') ?>" style="margin-top:10px;">Kembali</a>
    </form>
    <?php endif; ?>
  </div>
</div>

<?= $this->endSection() ?>
