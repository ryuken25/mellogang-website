<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<div class="container">
  <div class="panel" style="text-align:center;padding:64px 24px;">
    <div style="font-family:'Space Grotesk',sans-serif;font-size:96px;font-weight:700;line-height:1;color:#00F5B8;">404</div>
    <h2 class="section__title" style="margin-top:16px;">Halaman Tidak Ditemukan</h2>
    <p class="auth-sub" style="margin:12px auto 28px;max-width:420px;">
      Halaman yang kamu cari tidak ada, sudah dipindah, atau link-nya salah ketik.
    </p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a class="btnPrimary" href="<?= site_url('/') ?>">Kembali ke Beranda</a>
      <a class="btnGhost" href="<?= site_url('katalog') ?>">Lihat Katalog</a>
    </div>
  </div>
</div>

<?= $this->endSection() ?>
