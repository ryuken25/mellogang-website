<?= $this->extend('layout/admin') ?>

<?= $this->section('adminContent') ?>

<?php
$isEn = \App\Support\I18n::isEn();
?>

<div class="admin-hero">
  <div>
    <div class="admin-hero__chip"><?= $isEn ? 'Catalog' : 'Katalog' ?></div>
    <h1 class="admin-hero__title"><?= $isEn ? 'Packages' : 'Paket' ?></h1>
    <p class="admin-hero__sub"><?= $isEn ? 'Manage your service packages — add, edit, and toggle availability.' : 'Kelola paket layanan — tambah, edit, dan atur ketersediaan.' ?></p>
  </div>
  <a class="btn btn-primary" href="<?= site_url('admin/paket/create') ?>">
    <span>+ <?= $isEn ? 'Add package' : 'Tambah Paket' ?></span>
  </a>
</div>

<?php if (session()->getFlashdata('success')): ?>
  <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('error')): ?>
  <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
<?php endif; ?>

<div class="panel" style="padding:0;overflow:hidden;">
  <div style="overflow-x:auto;">
    <table class="table" style="margin:0;">
      <thead>
        <tr>
          <th style="min-width:240px;"><?= $isEn ? 'Name' : 'Nama' ?></th>
          <th style="min-width:120px;"><?= $isEn ? 'Category' : 'Kategori' ?></th>
          <th style="min-width:140px;"><?= $isEn ? 'Price' : 'Harga' ?></th>
          <th style="min-width:80px;"><?= $isEn ? 'Active' : 'Aktif' ?></th>
          <th style="min-width:160px;"><?= $isEn ? 'Actions' : 'Aksi' ?></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($paket)): ?>
          <tr><td colspan="5" style="text-align:center;padding:30px;color:var(--muted);"><?= $isEn ? 'No packages yet.' : 'Belum ada paket.' ?></td></tr>
        <?php else: ?>
          <?php foreach ($paket as $p): ?>
            <tr>
              <td>
                <div style="font-weight:600;"><?= esc($p['nama_paket']) ?></div>
                <?php if (! empty($p['deskripsi'])): ?>
                  <div style="color:var(--muted);font-size:12px;margin-top:2px;"><?= esc(mb_strimwidth((string) $p['deskripsi'], 0, 60, '…')) ?></div>
                <?php endif; ?>
              </td>
              <td><span class="pill"><?= esc($p['kategori']) ?></span></td>
              <td style="font-family:'Space Grotesk',sans-serif;font-weight:700;color:var(--brand);">Rp <?= number_format((int) $p['harga'], 0, ',', '.') ?></td>
              <td>
                <?php if ((int) $p['is_active'] === 1): ?>
                  <span class="pill status-ok"><?= $isEn ? 'Yes' : 'Ya' ?></span>
                <?php else: ?>
                  <span class="pill status-danger"><?= $isEn ? 'No' : 'Tidak' ?></span>
                <?php endif; ?>
              </td>
              <td>
                <div style="display:flex;gap:6px;">
                  <a class="btnGhost" style="padding:4px 10px;font-size:12px;" href="<?= site_url('admin/paket/edit/'.$p['id_paket']) ?>"><?= $isEn ? 'Edit' : 'Edit' ?></a>
                  <form method="post" action="<?= site_url('admin/paket/delete/'.$p['id_paket']) ?>" style="display:inline;" onsubmit="return confirm('<?= $isEn ? 'Delete this package?' : 'Hapus paket ini?' ?>');">
                    <?= csrf_field() ?>
                    <button type="submit" class="btnDanger" style="padding:4px 10px;font-size:12px;"><?= $isEn ? 'Delete' : 'Hapus' ?></button>
                  </form>
                </div>
              </td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?= $this->endSection() ?>
