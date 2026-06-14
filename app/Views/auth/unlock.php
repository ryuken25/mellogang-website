<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<div class="auth-wrap">
  <h1 class="auth-title">Buka Kunci Akun</h1>
  <p class="auth-sub">Akun kamu terkunci sementara. Klik link dari email atau minta link baru di sini.</p>

  <div class="card">
    <?php if (session()->getFlashdata('error')): ?>
      <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
    <?php endif; ?>
    <?php if (session()->getFlashdata('success')): ?>
      <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
    <?php endif; ?>

    <p style="color:#8FA39D;font-size:14px;margin-bottom:14px;">
      Buka kunci otomatis lewat link di email. Kalau link tidak ada, login dulu untuk memicu kirim ulang.
    </p>

    <a class="btn" href="<?= site_url('login') ?>">Kembali ke Login</a>
  </div>
</div>

<?= $this->endSection() ?>
