<?= $this->extend('layout/admin') ?>

<?= $this->section('adminContent') ?>

<?php $isEn = \App\Support\I18n::isEn(); ?>

<div class="admin-hero">
  <div>
    <div class="admin-hero__chip"><?= $isEn ? 'People' : 'Orang' ?></div>
    <h1 class="admin-hero__title"><?= $isEn ? 'Users' : 'Users' ?></h1>
    <p class="admin-hero__sub"><?= $isEn ? 'Edit profiles and toggle roles between customer, editor, and admin.' : 'Edit profil dan ubah role antara pelanggan, editor, dan admin.' ?></p>
  </div>
</div>

<?php if (session()->getFlashdata('success')): ?>
  <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
<?php endif; ?>
<?php if (session()->getFlashdata('error')): ?>
  <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
<?php endif; ?>

<div class="panel">
  <form method="get" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px;">
    <input class="input" name="q" value="<?= esc($q ?? '') ?>" placeholder="<?= $isEn ? 'Search name / email / phone' : 'Cari nama/email/telepon' ?>" style="max-width:280px;">
    <select class="input" name="role" style="max-width:200px;">
      <option value=""><?= $isEn ? 'All roles' : 'Semua Role' ?></option>
      <?php foreach (['admin','editor','pelanggan'] as $r): ?>
        <option value="<?= esc($r) ?>" <?= (($role ?? '') === $r) ? 'selected' : '' ?>><?= esc(ucfirst($r)) ?></option>
      <?php endforeach; ?>
    </select>
    <button class="btn btn-primary" type="submit"><?= $isEn ? 'Filter' : 'Filter' ?></button>
    <a class="btnGhost" href="<?= site_url('admin/users') ?>"><?= $isEn ? 'Reset' : 'Reset' ?></a>
  </form>
</div>

<div class="panel" style="padding:0;overflow:hidden;">
  <div style="overflow-x:auto;">
    <table class="table" style="margin:0;">
      <thead>
        <tr>
          <th style="width:80px;">ID</th>
          <th style="min-width:200px;"><?= $isEn ? 'Name' : 'Nama' ?></th>
          <th style="min-width:200px;"><?= $isEn ? 'Email' : 'Email' ?></th>
          <th style="width:140px;"><?= $isEn ? 'Phone' : 'Telepon' ?></th>
          <th style="width:120px;"><?= $isEn ? 'Role' : 'Role' ?></th>
          <th style="width:200px;"><?= $isEn ? 'Actions' : 'Aksi' ?></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($rows)): ?>
          <tr><td colspan="6" style="text-align:center;padding:30px;color:var(--muted);"><?= $isEn ? 'No users yet.' : 'Belum ada user.' ?></td></tr>
        <?php else: ?>
          <?php foreach ($rows as $u): ?>
            <tr>
              <td style="font-family:'Space Grotesk',monospace;font-size:12px;"><?= (int) $u['id_user'] ?></td>
              <td><?= esc($u['nama_lengkap'] ?? '-') ?></td>
              <td><?= esc($u['email'] ?? '-') ?></td>
              <td><?= esc($u['no_telepon'] ?? '-') ?></td>
              <td><span class="pill"><?= esc(ucfirst($u['role'] ?? '-')) ?></span></td>
              <td>
                <div style="display:flex;gap:6px;">
                  <a class="btnGhost" style="padding:4px 10px;font-size:12px;" href="<?= site_url('admin/users/edit/'.$u['id_user']) ?>">Edit</a>
                  <?php if (($u['role'] ?? '') !== 'admin'): ?>
                    <form method="post" action="<?= site_url('admin/users/delete/'.$u['id_user']) ?>" style="display:inline;" onsubmit="return confirm('<?= $isEn ? 'Delete this user?' : 'Hapus user ini?' ?>');">
                      <?= csrf_field() ?>
                      <button type="submit" class="btnDanger" style="padding:4px 10px;font-size:12px;"><?= $isEn ? 'Delete' : 'Delete' ?></button>
                    </form>
                  <?php endif; ?>
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
