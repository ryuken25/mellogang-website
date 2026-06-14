<?= $this->extend('layout/admin') ?>

<?= $this->section('adminContent') ?>

<?php $isEn = \App\Support\I18n::isEn(); ?>

<div class="admin-hero">
  <div>
    <div class="admin-hero__chip"><?= $isEn ? 'Showcase' : 'Etalase' ?></div>
    <h1 class="admin-hero__title"><?= $isEn ? 'Portfolio' : 'Portofolio' ?></h1>
    <p class="admin-hero__sub"><?= $isEn ? 'Curate your best work. Add, edit, and remove pieces shown on the public site.' : 'Pilih hasil karya terbaikmu. Tambah, edit, dan hapus karya yang ditampilkan di situs publik.' ?></p>
  </div>
  <a class="btn btn-primary" href="<?= site_url('admin/portofolio/create') ?>">
    <span>+ <?= $isEn ? 'Add item' : 'Tambah Portofolio' ?></span>
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
          <th style="width:90px;">Thumb</th>
          <th style="min-width:200px;"><?= $isEn ? 'Title' : 'Judul' ?></th>
          <th style="width:140px;"><?= $isEn ? 'Category' : 'Kategori' ?></th>
          <th style="width:160px;">URL</th>
          <th style="width:180px;"><?= $isEn ? 'Actions' : 'Aksi' ?></th>
        </tr>
      </thead>
      <tbody>
        <?php if (empty($items)): ?>
          <tr><td colspan="5" style="text-align:center;padding:30px;color:var(--muted);"><?= $isEn ? 'No portfolio items yet.' : 'Belum ada portofolio.' ?></td></tr>
        <?php else: ?>
          <?php foreach ($items as $po):
            $thumb = base_url('assets/images/porto_placeholder.png');
            $thumbName = (string)($po['thumbnail'] ?? '');
            if ($thumbName !== '') {
                $thumb = base_url('uploads/portofolio/' . $thumbName);
            }
          ?>
            <tr>
              <td>
                <div style="width:80px;height:50px;border-radius:8px;background-image:url('<?= esc($thumb) ?>');background-size:cover;background-position:center;border:1px solid var(--border);background-color:var(--surface-2);"></div>
              </td>
              <td>
                <div style="font-weight:600;"><?= esc($po['judul']) ?></div>
                <?php if (! empty($po['deskripsi'])): ?>
                  <div style="color:var(--muted);font-size:12px;margin-top:2px;"><?= esc(mb_strimwidth((string) $po['deskripsi'], 0, 60, '…')) ?></div>
                <?php endif; ?>
              </td>
              <td><span class="pill"><?= esc($po['kategori']) ?></span></td>
              <td><a class="link" target="_blank" rel="noopener" href="<?= esc($po['url_media'] ?? '#') ?>"><?= $isEn ? 'Open' : 'Buka' ?></a></td>
              <td>
                <div style="display:flex;gap:6px;">
                  <a class="btnGhost" style="padding:4px 10px;font-size:12px;" href="<?= site_url('admin/portofolio/edit/'.$po['id_portfolio']) ?>"><?= $isEn ? 'Edit' : 'Edit' ?></a>
                  <form method="post" action="<?= site_url('admin/portofolio/delete/'.$po['id_portfolio']) ?>" style="display:inline;" onsubmit="return confirm('<?= $isEn ? 'Delete this item?' : 'Hapus portofolio ini?' ?>');">
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
