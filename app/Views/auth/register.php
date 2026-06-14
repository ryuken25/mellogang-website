<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<div class="auth-wrap">
  <h1 class="auth-title">Daftar Akun</h1>
  <p class="auth-sub">Buat akun pelanggan MellogangVisuals. Verifikasi email dulu sebelum bisa login.</p>

  <div class="card">
    <div class="tabs">
      <a class="tab" href="<?= site_url('/login') ?>">Login</a>
      <a class="tab active" href="<?= site_url('/register') ?>">Daftar Akun</a>
    </div>

    <?php if (session()->getFlashdata('error')): ?>
      <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
    <?php endif; ?>

    <?php if (! empty($googleOn)): ?>
      <a class="btn-google" href="<?= site_url('auth/google/redirect') ?>">
        <span class="g">G</span>
        <span>Lanjut dengan Google</span>
      </a>
      <div class="divider"><span>atau</span></div>
    <?php endif; ?>

    <form class="form" method="post" action="<?= site_url('/register') ?>">
      <?= csrf_field() ?>

      <div>
        <div class="label">Nama lengkap</div>
        <input class="input" type="text" name="nama_lengkap" value="<?= old('nama_lengkap') ?>" placeholder="Nama kamu" autocomplete="name">
        <?php if ($validation->hasError('nama_lengkap')): ?>
          <div class="label" style="color:#b91c1c;"><?= esc($validation->getError('nama_lengkap')) ?></div>
        <?php endif; ?>
      </div>

      <div class="row">
        <div>
          <div class="label">Email</div>
          <input class="input" type="email" name="email" value="<?= old('email') ?>" placeholder="contoh@email.com" autocomplete="email">
          <?php if ($validation->hasError('email')): ?>
            <div class="label" style="color:#b91c1c;"><?= esc($validation->getError('email')) ?></div>
          <?php endif; ?>
        </div>
        <div>
          <div class="label">No. Telepon</div>
          <input class="input" type="tel" name="no_telepon" value="<?= old('no_telepon') ?>" placeholder="08xxxxxxxxxx" autocomplete="tel">
          <?php if ($validation->hasError('no_telepon')): ?>
            <div class="label" style="color:#b91c1c;"><?= esc($validation->getError('no_telepon')) ?></div>
          <?php endif; ?>
        </div>
      </div>

      <div class="row">
        <div>
          <div class="label">Kata sandi</div>
          <input class="input" type="password" name="password" placeholder="min. 8 karakter, huruf + angka" autocomplete="new-password">
          <?php if ($validation->hasError('password')): ?>
            <div class="label" style="color:#b91c1c;"><?= esc($validation->getError('password')) ?></div>
          <?php endif; ?>
        </div>
        <div>
          <div class="label">Konfirmasi kata sandi</div>
          <input class="input" type="password" name="password_confirm" placeholder="ulangi sandi" autocomplete="new-password">
          <?php if ($validation->hasError('password_confirm')): ?>
            <div class="label" style="color:#b91c1c;"><?= esc($validation->getError('password_confirm')) ?></div>
          <?php endif; ?>
        </div>
      </div>

      <button class="btn" type="submit">Daftar</button>

      <div class="note">
        Sudah punya akun? <a class="link" href="<?= site_url('/login') ?>">Login</a>.
        <br>
        <span style="color:#8FA39D;font-size:12px;">
          Kami kirim kode OTP ke email kamu. Cek folder Spam/Promosi kalau tidak masuk.
        </span>
      </div>
    </form>
  </div>
</div>

<?= $this->endSection() ?>
