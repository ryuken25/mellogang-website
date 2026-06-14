<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<?php
$isEn = \App\Support\I18n::isEn();
$catLabel = [
    'wedding'   => $isEn ? 'Wedding'    : 'Pernikahan',
    'corporate' => $isEn ? 'Corporate'  : 'Korporat',
    'product'   => $isEn ? 'Product'    : 'Produk',
    'event'     => $isEn ? 'Event'      : 'Acara',
];
?>

<div class="porto">

  <!-- HERO -->
  <section class="porto-hero">
    <div class="porto-hero__top">
      <div class="porto-hero__chip">Portfolio · 2026</div>
      <a class="link" href="<?= site_url('/kontak') ?>"><?= $isEn ? 'Start a project →' : 'Mulai proyek →' ?></a>
    </div>

    <h1 class="porto-hero__title">
      <span class="porto-hero__line"><?= $isEn ? 'Selected work,' : 'Pilihan karya,' ?></span>
      <span class="porto-hero__line porto-hero__line--alt"><?= $isEn ? 'made with care.' : 'dibuat dengan rasa.' ?></span>
    </h1>

    <p class="porto-hero__sub">
      <?= $isEn
        ? 'A curated sample of recent photo & video projects across weddings, corporate, products, and live events.'
        : 'Kumpulan pilihan karya foto & video terbaru dari berbagai kategori: wedding, korporat, produk, dan event.'
      ?>
    </p>

    <div class="porto-hero__meta">
      <div class="porto-hero__meta-item">
        <div class="porto-hero__meta-num"><?= count($featured) + count($items) ?></div>
        <div class="porto-hero__meta-label"><?= $isEn ? 'Projects' : 'Proyek' ?></div>
      </div>
      <div class="porto-hero__meta-item">
        <div class="porto-hero__meta-num">4</div>
        <div class="porto-hero__meta-label"><?= $isEn ? 'Categories' : 'Kategori' ?></div>
      </div>
      <div class="porto-hero__meta-item">
        <div class="porto-hero__meta-num">100<span>%</span></div>
        <div class="porto-hero__meta-label"><?= $isEn ? 'In-house editing' : 'Editing internal' ?></div>
      </div>
    </div>
  </section>

  <!-- FEATURED CAROUSEL -->
  <?php if (! empty($featured)): ?>
  <section class="porto-section">
    <div class="porto-section__head">
      <div>
        <div class="porto-section__eyebrow"><?= $isEn ? 'Featured' : 'Unggulan' ?></div>
        <h2 class="porto-section__title"><?= $isEn ? 'Recent favourites.' : 'Favorit terbaru.' ?></h2>
      </div>
      <div class="porto-section__nav">
        <button class="porto-nav" type="button" data-dir="-1" aria-label="<?= esc($isEn ? 'Scroll left' : 'Geser kiri') ?>">←</button>
        <button class="porto-nav" type="button" data-dir="1" aria-label="<?= esc($isEn ? 'Scroll right' : 'Geser kanan') ?>">→</button>
      </div>
    </div>

    <div class="porto-rail" id="portoRail">
      <?php foreach ($featured as $i => $po): ?>
        <a class="porto-card" href="<?= ! empty($po['url_media']) ? esc($po['url_media']) : '#' ?>"
           target="_blank" rel="noopener" style="--i:<?= $i ?>;">
          <div class="porto-card__media"
               style="background-image:url('<?= esc($po['thumb'] ?? base_url('assets/images/porto_placeholder.png')) ?>');">
            <div class="porto-card__overlay">
              <div class="porto-card__cat"><?= esc($catLabel[$po['kategori']] ?? $po['kategori']) ?></div>
              <div class="porto-card__title"><?= esc($po['judul']) ?></div>
              <?php if (! empty($po['deskripsi'])): ?>
                <div class="porto-card__desc"><?= esc($po['deskripsi']) ?></div>
              <?php endif; ?>
            </div>
            <div class="porto-card__open">↗</div>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </section>
  <?php endif; ?>

  <!-- FILTER + GRID -->
  <section class="porto-section">
    <div class="porto-section__head">
      <div>
        <div class="porto-section__eyebrow"><?= $isEn ? 'All work' : 'Semua karya' ?></div>
        <h2 class="porto-section__title"><?= $isEn ? 'Browse the archive.' : 'Jelajahi arsip.' ?></h2>
      </div>
    </div>

    <div class="porto-filters" role="tablist">
      <button class="porto-filter is-active" data-filter="all" type="button"><?= $isEn ? 'All' : 'Semua' ?> <span class="porto-filter__count"><?= count($featured) + count($items) ?></span></button>
      <?php foreach ($categories as $c):
        $count = count(array_filter(array_merge($featured, $items), fn($i) => ($i['kategori'] ?? '') === $c));
        if ($count === 0) continue;
      ?>
        <button class="porto-filter" data-filter="<?= esc($c) ?>" type="button">
          <?= esc($catLabel[$c] ?? $c) ?> <span class="porto-filter__count"><?= $count ?></span>
        </button>
      <?php endforeach; ?>
    </div>

    <div class="porto-grid" id="portoGrid">
      <?php
      $all = array_merge($featured, $items);
      if (empty($all)):
      ?>
        <div class="empty-state"><div class="empty-state__title">No work yet.</div></div>
      <?php else: ?>
        <?php foreach ($all as $i => $po): ?>
          <a class="porto-tile porto-tile--<?= esc($po['kategori']) ?>"
             data-cat="<?= esc($po['kategori']) ?>"
             href="<?= ! empty($po['url_media']) ? esc($po['url_media']) : '#' ?>"
             target="_blank" rel="noopener"
             style="--i:<?= $i ?>;">
            <div class="porto-tile__media"
                 style="background-image:url('<?= esc($po['thumb'] ?? base_url('assets/images/porto_placeholder.png')) ?>');">
              <div class="porto-tile__cat"><?= esc($catLabel[$po['kategori']] ?? $po['kategori']) ?></div>
              <div class="porto-tile__hover">
                <div class="porto-tile__title"><?= esc($po['judul']) ?></div>
                <?php if (! empty($po['deskripsi'])): ?>
                  <div class="porto-tile__desc"><?= esc($po['deskripsi']) ?></div>
                <?php endif; ?>
                <div class="porto-tile__cta"><?= $isEn ? 'Open' : 'Buka' ?> ↗</div>
              </div>
            </div>
          </a>
        <?php endforeach; ?>
      <?php endif; ?>
    </div>
  </section>

  <!-- CTA -->
  <section class="porto-cta">
    <div>
      <div class="porto-cta__eyebrow"><?= $isEn ? 'Like what you see?' : 'Suka yang kamu lihat?' ?></div>
      <h2 class="porto-cta__title"><?= $isEn ? 'Let’s build something memorable.' : 'Ayo bikin sesuatu yang berkesan.' ?></h2>
    </div>
    <a class="btn btn-primary btn-lg" href="<?= site_url('/kontak') ?>">
      <span><?= $isEn ? 'Start a project' : 'Mulai proyek' ?></span>
      <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </section>
</div>

<script>
(function () {
  // ---- Carousel nav with smooth scroll ----
  const rail = document.getElementById('portoRail');
  document.querySelectorAll('.porto-nav').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!rail) return;
      const dir = parseInt(btn.getAttribute('data-dir') || '1', 10);
      const step = Math.max(rail.clientWidth * 0.78, 360);
      rail.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
  });

  // ---- Filter ----
  const grid = document.getElementById('portoGrid');
  document.querySelectorAll('.porto-filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.porto-filter').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      const f = btn.getAttribute('data-filter') || 'all';
      grid.querySelectorAll('.porto-tile').forEach(function (tile) {
        const cat = tile.getAttribute('data-cat');
        if (f === 'all' || cat === f) {
          tile.style.removeProperty('display');
          // re-trigger entrance animation
          tile.style.animation = 'none';
          // force reflow
          // eslint-disable-next-line no-unused-expressions
          tile.offsetHeight;
          tile.style.animation = '';
        } else {
          tile.style.display = 'none';
        }
      });
    });
  });

  // ---- Scroll-triggered reveal ----
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });
    document.querySelectorAll('.porto-section, .porto-hero, .porto-cta').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // ---- Mouse parallax on hero text ----
  const hero = document.querySelector('.porto-hero');
  const heroTitle = document.querySelector('.porto-hero__title');
  if (hero && heroTitle && window.matchMedia('(hover: hover)').matches) {
    hero.addEventListener('mousemove', function (e) {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroTitle.style.transform = 'translate3d(' + (x * 14) + 'px, ' + (y * 8) + 'px, 0)';
    });
    hero.addEventListener('mouseleave', function () {
      heroTitle.style.transform = '';
    });
  }

  // ---- Tilt effect on tiles (subtle) ----
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.porto-tile').forEach(function (tile) {
      tile.addEventListener('mousemove', function (e) {
        const r = tile.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transform = 'translate3d(' + (x * 4) + 'px, ' + (y * 4) + 'px, 0)';
        const media = tile.querySelector('.porto-tile__media');
        if (media) {
          media.style.transform = 'scale(1.06) translate(' + (-x * 6) + 'px, ' + (-y * 6) + 'px)';
        }
      });
      tile.addEventListener('mouseleave', function () {
        tile.style.transform = '';
        const media = tile.querySelector('.porto-tile__media');
        if (media) media.style.transform = '';
      });
    });
  }
})();
</script>

<?= $this->endSection() ?>
