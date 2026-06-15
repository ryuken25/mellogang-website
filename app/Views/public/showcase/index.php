<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<?php $isEn = \App\Support\I18n::isEn(); ?>

<div class="showcase">

  <!-- HERO -->
  <section class="sc-hero">
    <div class="sc-hero__top">
      <div class="sc-hero__chip">Showcase · 2026</div>
      <div class="sc-hero__meta">
        <span>•</span>
        <span>v2.0</span>
        <span>•</span>
        <span><?= count($shotGroups['publik']['shots']) + count($shotGroups['admin']['shots']) + count($shotGroups['pelanggan']['shots']) + count($shotGroups['editor']['shots']) ?> pages</span>
      </div>
    </div>

    <h1 class="sc-hero__title">
      <span class="sc-hero__line">A studio OS for</span>
      <span class="sc-hero__line sc-hero__line--alt">photo &amp; video teams.</span>
    </h1>

    <p class="sc-hero__sub">
      <?= $isEn
        ? 'MellogangVisuals is the booking, payment, and production-tracking app for our photo &amp; video studio. This page is a quick tour of the public site, customer dashboard, admin panel, and editor workspace — every screen you see is from the live build.'
        : 'MellogangVisuals adalah aplikasi pemesanan, pembayaran, dan pelacakan produksi untuk studio foto &amp; video. Halaman ini adalah tur singkat situs publik, dashboard pelanggan, panel admin, dan area kerja editor.'
      ?>
    </p>

    <div class="sc-hero__cta">
      <a class="btn btn-primary btn-lg" href="<?= site_url('/') ?>">
        <span><?= $isEn ? 'Open the app' : 'Buka aplikasi' ?></span>
        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a class="btnGhost" href="<?= site_url('/portofolio') ?>"><?= $isEn ? 'See our work' : 'Lihat karya' ?> →</a>
    </div>
  </section>

  <!-- SHOT GROUPS -->
  <?php foreach ($shotGroups as $key => $group): if (empty($group['shots'])) continue; ?>
    <section class="sc-section sc-shots" data-group="<?= esc($key) ?>">
      <div class="sc-section__head">
        <div>
          <div class="sc-section__eyebrow"><?= esc($key) ?></div>
          <h2 class="sc-section__title"><?= esc($group['label']) ?></h2>
        </div>
      </div>

      <div class="sc-shot-grid">
        <?php foreach ($group['shots'] as $i => $s):
          $url = $s['url'] ?? null;
        ?>
          <a class="sc-shot <?= $s['view'] === 'mobile' ? 'sc-shot--mobile' : 'sc-shot--desktop' ?>"
             style="--i:<?= $i ?>;"
             <?= $url ? 'href="' . site_url($url) . '"' : '' ?>
             <?= $url ? 'target="_blank" rel="noopener"' : '' ?>>
            <div class="sc-shot__media" style="background-image:url('<?= base_url($s['file']) ?>');">
              <div class="sc-shot__chip"><?= $s['view'] === 'mobile' ? 'iPhone 13 Pro' : 'Desktop' ?></div>
            </div>
            <div class="sc-shot__caption">
              <div class="sc-shot__label"><?= esc($s['label']) ?></div>
              <div class="sc-shot__url"><?= $url ? esc($url) : '—' ?></div>
            </div>
          </a>
        <?php endforeach; ?>
      </div>
    </section>
  <?php endforeach; ?>

  <!-- FEATURES -->
  <section class="sc-section">
    <div class="sc-section__head">
      <div>
        <div class="sc-section__eyebrow"><?= $isEn ? 'Why it works' : 'Kenapa keren' ?></div>
        <h2 class="sc-section__title"><?= $isEn ? 'Built for the messy reality of production.' : 'Dibangun untuk realita produksi yang berantakan.' ?></h2>
      </div>
    </div>

    <div class="sc-features">
      <?php foreach ($features as $i => $f): ?>
        <div class="sc-feature" style="--i:<?= $i ?>;">
          <div class="sc-feature__eyebrow"><?= esc($f['eyebrow']) ?></div>
          <h3 class="sc-feature__title"><?= esc($f['title']) ?></h3>
          <p class="sc-feature__body"><?= $f['body'] /* HTML allowed: <em> */ ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- STACK -->
  <section class="sc-section">
    <div class="sc-section__head">
      <div>
        <div class="sc-section__eyebrow">Stack</div>
        <h2 class="sc-section__title"><?= $isEn ? 'Honest tools, no AI look.' : 'Tool yang jujur, tanpa vibe AI.' ?></h2>
      </div>
    </div>

    <div class="sc-stack">
      <?php foreach ($stack as $i => $t): ?>
        <div class="sc-stack__chip" style="--i:<?= $i ?>;"><?= esc($t) ?></div>
      <?php endforeach; ?>
    </div>
  </section>

  <!-- CTA -->
  <section class="sc-cta">
    <div>
      <div class="sc-cta__eyebrow"><?= $isEn ? 'Ready when you are' : 'Siap kalau kamu siap' ?></div>
      <h2 class="sc-cta__title"><?= $isEn ? 'Let’s book a date.' : 'Ayo pesan tanggal.' ?></h2>
      <p class="sc-cta__sub"><?= $isEn ? 'Browse packages, check availability, and lock in your date in minutes.' : 'Lihat paket, cek ketersediaan, dan kunci tanggal kamu dalam hitungan menit.' ?></p>
    </div>
    <div class="sc-cta__actions">
      <a class="btn btn-primary btn-lg" href="<?= site_url('/katalog') ?>">
        <span><?= $isEn ? 'View packages' : 'Lihat paket' ?></span>
        <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a class="btnGhost" href="<?= site_url('/kontak') ?>"><?= $isEn ? 'Contact us' : 'Kontak kami' ?> →</a>
    </div>
  </section>
</div>

<script>
(function () {
  // Scroll reveal (reuse .reveal)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.sc-section, .sc-hero, .sc-cta').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }
})();
</script>

<?= $this->endSection() ?>
