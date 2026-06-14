<!doctype html>
<html lang="<?= esc(\App\Support\I18n::htmlLang()) ?>">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= esc($title ?? 'MellogangVisuals') ?></title>

  <link rel="icon" type="image/png" href="<?= base_url('assets/images/logomlg.png') ?>">
  <meta name="theme-color" content="#0A0E0D">
  <link rel="stylesheet" href="<?= base_url('assets/css/app.css') ?>">
</head>
<body class="admin-page">

  <?= $this->include('layout/navbar') ?>

  <div class="adminShell">
    <aside class="adminShell__sidebar">
      <?= $this->include('admin/_sidebar') ?>
    </aside>
    <section class="adminShell__content">
      <?= $this->renderSection('adminContent') ?>
    </section>
  </div>

  <?= $this->include('layout/footer') ?>

  <script>
    (function() {
      var show = <?= json_encode((bool) session()->getFlashdata('show_tugas_popup')) ?>;
      if (!show) return;
      var el = document.getElementById('tugasModal');
      if (!el) return;
      if (window.bootstrap && bootstrap.Modal) {
        bootstrap.Modal.getOrCreateInstance(el).show();
      }
    })();
  </script>
</body>
</html>
