<?= $this->extend('layout/admin') ?>

<?= $this->section('adminContent') ?>

<?php $isEn = \App\Support\I18n::isEn(); ?>

<div class="admin-hero">
  <div>
    <div class="admin-hero__chip"><?= $isEn ? 'Schedule' : 'Jadwal' ?></div>
    <h1 class="admin-hero__title"><?= $isEn ? 'Production schedule' : 'Jadwal Produksi' ?></h1>
    <p class="admin-hero__sub"><?= $isEn ? 'Assign editors and plan shoots for every booking.' : 'Assign editor dan jadwalkan shooting untuk setiap pemesanan.' ?></p>
  </div>
  <a class="btn btn-primary" href="<?= site_url('admin/jadwal/create') ?>">
    <span>+ <?= $isEn ? 'New schedule' : 'Buat Jadwal' ?></span>
  </a>
</div>

<?php if (session()->getFlashdata('success')): ?>
  <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
<?php endif; ?>

<div class="panel" style="padding:0;overflow:hidden;">
  <div style="overflow-x:auto;">
    <table class="table" style="margin:0;">
      <thead>
        <tr>
          <th style="width:140px;"><?= $isEn ? 'Code' : 'Kode' ?></th>
          <th style="min-width:160px;"><?= $isEn ? 'Editor' : 'Editor' ?></th>
          <th style="width:200px;"><?= $isEn ? 'Shooting' : 'Shooting' ?></th>
          <th style="width:180px;"><?= $isEn ? 'Production' : 'Status Produksi' ?></th>
          <th style="width:120px;"><?= $isEn ? 'Action' : 'Aksi' ?></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
          <tr><td colspan="5" style="text-align:center;padding:30px;color:var(--muted);"><?= $isEn ? 'No schedule yet.' : 'Belum ada jadwal.' ?></td></tr>
        <?php else: ?>
          <?php foreach ($rows as $r):
            $st = strtolower((string)($r['status_produksi'] ?? ''));
            $stColor = match ($st) {
              'done','revisi_selesai' => 'ok',
              'revisi' => 'warn',
              'shooting','cut_to_cut','finishing' => 'brand',
              default => 'muted',
            };
          ?>
            <tr>
              <td style="font-family:'Space Grotesk',monospace;font-size:12px;"><?= esc($r['kode_pemesanan'] ?? '-') ?></td>
              <td><?= esc($r['nama_editor'] ?? '-') ?></td>
              <td>
                <?= esc($r['tanggal_shooting']) ?>
                <span class="muted">(<?= esc($r['jam_mulai_shooting']) ?>-<?= esc($r['jam_selesai_shooting']) ?>)</span>
              </td>
              <td><span class="pill status-<?= $stColor ?>"><?= esc(ucwords(str_replace('_', ' ', $r['status_produksi'] ?? '-'))) ?></span></td>
              <td><a class="btnGhost" style="padding:4px 10px;font-size:12px;" href="<?= site_url('admin/jadwal/edit/'.$r['id_jadwal']) ?>"><?= $isEn ? 'Edit' : 'Edit' ?></a></td>
            </tr>
          <?php endforeach; ?>
        <?php endif; ?>
      </tbody>
    </table>
  </div>
</div>

<?= $this->endSection() ?>
