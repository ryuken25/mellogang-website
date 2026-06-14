<?php
$uri = service('uri');
$path = $uri->getPath();

function isAdminActive($path, $needle) {
  return $path === $needle || str_starts_with($path, $needle . '/');
}

$navItems = [
  ['label' => 'Overview',    'url' => site_url('admin'),             'match' => $path === 'admin' || $path === 'admin/'],
  ['label' => 'Bookings',    'url' => site_url('admin/pemesanan'),   'match' => str_starts_with($path, 'admin/pemesanan')],
  ['label' => 'Schedule',    'url' => site_url('admin/jadwal'),      'match' => str_starts_with($path, 'admin/jadwal')],
  ['label' => 'Packages',    'url' => site_url('admin/paket'),        'match' => str_starts_with($path, 'admin/paket')],
  ['label' => 'Portfolio',   'url' => site_url('admin/portofolio'),  'match' => str_starts_with($path, 'admin/portofolio')],
  ['label' => 'Payments',    'url' => site_url('admin/pembayaran'),   'match' => str_starts_with($path, 'admin/pembayaran')],
  ['label' => 'Users',       'url' => site_url('admin/users'),        'match' => str_starts_with($path, 'admin/users')],
  ['label' => 'Reports',     'url' => site_url('admin/laporan'),      'match' => str_starts_with($path, 'admin/laporan')],
  ['label' => 'Social cache','url' => site_url('admin/social'),       'match' => str_starts_with($path, 'admin/social')],
];
?>
<aside class="adminSide">
  <div class="adminSide__head">
    <div class="adminSide__brand">
      <img src="<?= base_url('assets/images/logomlg.png') ?>" alt="MellogangVisuals">
      <div>
        <div class="adminSide__title">Admin</div>
        <div class="adminSide__sub">Mellogang Visuals</div>
      </div>
    </div>
  </div>

  <nav class="adminNav">
    <?php foreach ($navItems as $item): ?>
      <a class="adminNav__item <?= isAdminActive($path, $item['match']) ? 'is-active' : '' ?>" href="<?= esc($item['url']) ?>">
        <span class="adminNav__dot"></span>
        <span><?= esc($item['label']) ?></span>
      </a>
    <?php endforeach; ?>
  </nav>

  <div class="adminSide__foot">
    <a class="adminNav__item" href="<?= site_url('/') ?>">
      <span class="adminNav__dot"></span>
      <span>Back to site</span>
    </a>
    <a class="adminNav__item adminNav__item--danger" href="<?= site_url('/logout') ?>">
      <span class="adminNav__dot"></span>
      <span>Sign out</span>
    </a>
  </div>
</aside>
