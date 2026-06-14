<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<div class="auth-wrap">
  <h1 class="auth-title">Verifikasi Akun</h1>
  <p class="auth-sub">Masukkan kode OTP yang dikirim ke email kamu, atau klik link di email.</p>

  <div class="card">
    <?php if (session()->getFlashdata('error')): ?>
      <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
    <?php endif; ?>

    <?php if (session()->getFlashdata('success')): ?>
      <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
    <?php endif; ?>

    <form class="form" method="post" action="<?= site_url('auth/verify') ?>">
      <?= csrf_field() ?>
      <input type="hidden" name="email" value="<?= esc(old('email', $email ?? '')) ?>">

      <div>
        <div class="label">Kode OTP</div>
        <input class="input otp" type="text" name="otp" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="6 digit" autocomplete="one-time-code">
        <?php if ($validation->hasError('otp')): ?>
          <div class="label" style="color:#b91c1c;"><?= esc($validation->getError('otp')) ?></div>
        <?php endif; ?>
        <div class="label" style="color:#8FA39D;margin-top:6px;">
          Tidak masuk? Cek folder Spam/Promosi. Kode berlaku 15 menit.
        </div>
      </div>

      <button class="btn" type="submit">Verifikasi</button>
    </form>

    <form method="post" action="<?= site_url('auth/resend-otp') ?>" style="margin-top:12px;">
      <?= csrf_field() ?>
      <input type="hidden" name="email" value="<?= esc(old('email', $email ?? '')) ?>">
      <button type="submit" class="btn-ghost" style="width:100%;">Kirim ulang kode</button>
    </form>
  </div>
</div>

<?= $this->endSection() ?>
