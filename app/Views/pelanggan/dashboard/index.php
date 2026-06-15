<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<?php
$isEn = \App\Support\I18n::isEn();
$monthShort = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/**
 * Map canonical status (snake_case) -> short CSS modifier + humanized label.
 * DB enum TIDAK disentuh; hanya label tampilan + class modifier.
 */
// Build status map programmatically to avoid long inline ternaries.
$canonicalStatuses = [
    'menunggu_pembayaran', 'menunggu_pelunasan', 'menunggu_verifikasi',
    'lunas', 'revisi_pelanggan', 'revisi_diproses',
    'serah_terima_hasil', 'selesai', 'batal', 'ditolak',
];
$statusMap = [];
foreach ($canonicalStatuses as $cs) {
    $key = match ($cs) {
        'menunggu_pembayaran', 'menunggu_pelunasan', 'menunggu_verifikasi' => 'awaiting',
        'lunas'                => 'paid',
        'revisi_pelanggan'     => 'revisi',
        'revisi_diproses', 'serah_terima_hasil' => 'processing',
        'selesai'              => 'done',
        'batal', 'ditolak'     => 'cancelled',
        default                => 'muted',
    };
    $label = \App\Support\I18n::t('status.' . $cs);
    $statusMap[$cs] = ['key' => $key, 'label' => $label];
}

/**
 * Status yang masih butuh aksi bayar/lacak (vs cukup lihat detail).
 */
$finalStatuses = ['batal', 'ditolak', 'lunas', 'selesai', 'serah_terima_hasil'];
$isFinal = function (string $s) use ($finalStatuses): bool {
    return in_array($s, $finalStatuses, true);
};

/**
 * Format tanggal pendek "23 Jun 2026" + short EN variant.
 */
$formatDate = static function (?string $raw) use ($isEn, $monthShort): string {
    if (! $raw || $raw === '-') return '—';
    $ts = strtotime($raw);
    if (! $ts) return esc($raw);
    $day = date('j', $ts);
    if ($isEn) {
        $monthEn = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return $day . ' ' . $monthEn[(int) date('n', $ts)] . ' ' . date('Y', $ts);
    }
    return $day . ' ' . $monthShort[(int) date('n', $ts)] . ' ' . date('Y', $ts);
};
?>

<div class="container">

  <?php if (session()->getFlashdata('success')): ?>
    <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
  <?php endif; ?>
  <?php if (session()->getFlashdata('error')): ?>
    <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
  <?php endif; ?>

  <!-- Hero -->
  <section class="customer-hero">
    <div class="customer-hero__text">
      <div class="customer-hero__chip"><?= $isEn ? 'Customer dashboard' : 'Dashboard pelanggan' ?></div>
      <h1 class="customer-hero__title"><?= esc(t('dashboard.welcome', ['name' => esc($nama)])) ?></h1>
      <p class="customer-hero__sub"><?= esc(t('dashboard.customer.subtitle')) ?></p>
      <div class="customer-hero__cta">
        <a class="btn btn-primary" href="<?= site_url('pelanggan/pemesanan/buat') ?>">
          <span><?= esc(t('home.cta.viewPackages')) ?></span>
          <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <a class="btnGhost" href="<?= site_url('status-pesanan') ?>"><?= esc(t('nav.status')) ?></a>
      </div>
    </div>
    <div class="customer-hero__stats">
      <div class="kpi">
        <div class="kpi__value"><?= count($orders) ?></div>
        <div class="kpi__label"><?= $isEn ? 'Active orders' : 'Pesanan aktif' ?></div>
      </div>
      <div class="kpi">
        <div class="kpi__value"><?= count(array_filter($orders, fn($o) => str_contains((string)($o['status_pemesanan'] ?? ''), 'revisi'))) ?></div>
        <div class="kpi__label"><?= $isEn ? 'In revision' : 'Direvisi' ?></div>
      </div>
      <div class="kpi">
        <div class="kpi__value"><?= count(array_filter($orders, fn($o) => str_contains((string)($o['status_pemesanan'] ?? ''), 'selesai') || str_contains((string)($o['status_pemesanan'] ?? ''), 'serah'))) ?></div>
        <div class="kpi__label"><?= $isEn ? 'Delivered' : 'Selesai' ?></div>
      </div>
    </div>
  </section>

  <!-- Order ledger -->
  <section class="panel">
    <h3 class="section__title" style="margin:0 0 12px 0;"><?= $isEn ? 'Pesanan kamu' : 'Pesanan kamu' ?></h3>

    <?php if (empty($orders)): ?>
      <div class="empty-state">
        <div class="empty-state__title"><?= $isEn ? 'No bookings yet.' : 'Belum ada pesanan.' ?></div>
        <div class="empty-state__sub">
          <a class="link" href="<?= site_url('pelanggan/pemesanan/buat') ?>"><?= $isEn ? 'Browse packages' : 'Mulai dari katalog' ?></a>
        </div>
      </div>
    <?php else: ?>
      <div class="booking-grid">
        <?php foreach ($orders as $i => $o):
          $kode     = (string)($o['kode_pemesanan'] ?? '');
          $kodeUrl  = site_url('status-pesanan?kode=' . urlencode($kode));
          $status   = (string)($o['status_pemesanan'] ?? '');
          $sm       = $statusMap[$status] ?? ['key' => 'muted', 'label' => ucwords(str_replace('_', ' ', $status))];
          $showPay  = ! $isFinal($status);
          $total    = (int)($o['total_biaya'] ?? 0);
          $event    = $o['tanggal_acara'] ?? null;
          $actionLabel = $showPay
              ? ($isEn ? 'Pay or track' : 'Bayar atau lacak')
              : ($isEn ? 'View details' : 'Lihat detail');
        ?>
          <article class="booking-card" data-idx="<?= $i ?>">
            <div class="booking-card__row booking-card__row--top">
              <span class="booking-ref"><?= esc($kode) ?></span>
              <span class="status status--<?= esc($sm['key']) ?>">
                <span class="status-dot" aria-hidden="true"></span>
                <span class="status-label"><?= esc($sm['label']) ?></span>
              </span>
            </div>

            <h3 class="booking-title"><?= esc($o['nama_paket'] ?? '-') ?></h3>

            <div class="booking-meta">
              <div class="booking-meta__cell">
                <div class="booking-meta__label"><?= $isEn ? 'Event date' : 'Tanggal acara' ?></div>
                <div class="booking-meta__value">
                  <svg class="booking-meta__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="16" rx="2"/>
                    <path d="M3 9h18M8 3v4M16 3v4"/>
                  </svg>
                  <span><?= esc($formatDate($event)) ?></span>
                </div>
              </div>
              <div class="booking-meta__cell">
                <div class="booking-meta__label"><?= $isEn ? 'Total' : 'Total' ?></div>
                <div class="booking-meta__value booking-meta__value--price">
                  <span class="booking-price" data-price="<?= $total ?>">Rp <?= number_format($total, 0, ',', '.') ?></span>
                </div>
              </div>
            </div>

            <a class="track-link" data-magnetic href="<?= esc($kodeUrl) ?>" aria-label="<?= esc($actionLabel . ' ' . $kode) ?>">
              <span><?= esc($actionLabel) ?></span>
              <span class="arrow" aria-hidden="true">&rarr;</span>
            </a>
          </article>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </section>

  <!-- Portofolio preview -->
  <?php if (! empty($porto)): ?>
    <section class="panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">
        <h3 class="section__title" style="margin:0;"><?= esc(t('dashboard.customer.recommendedWork')) ?></h3>
        <a class="link" href="<?= site_url('/portofolio') ?>"><?= esc(t('dashboard.customer.viewAll')) ?></a>
      </div>
      <div class="porto-strip">
        <?php foreach ($porto as $p): ?>
          <a class="porto-strip__item" href="<?= site_url('/portofolio') ?>" style="background-image:url('<?= esc($p['thumb'] ?? '') ?>');" aria-label="<?= esc($p['judul'] ?? '') ?>">
            <div class="porto-strip__overlay">
              <div class="porto-strip__title"><?= esc($p['judul']) ?></div>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endif; ?>
</div>

<script src="<?= base_url('assets/js/booking-cards.js') ?>" defer></script>

<?= $this->endSection() ?>
