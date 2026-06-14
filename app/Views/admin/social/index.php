<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<div class="container">
  <h2 class="section__title">Social Cache (YouTube &amp; Instagram)</h2>
  <p class="muted">
    Tekan <b>Fetch YouTube &amp; Instagram</b> untuk menarik posting terbaru ke cache lokal
    (<code>social_post</code>). Portofolio publik membaca dari cache — jadi tidak ada scraping
    saat visitor buka halaman. Worker Node Playwright harus sudah terinstall di
    <code>tools/social-fetcher/</code>.
  </p>

  <?php if (session()->getFlashdata('success')): ?>
    <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
  <?php endif; ?>
  <?php if (session()->getFlashdata('error')): ?>
    <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
  <?php endif; ?>

  <div class="panel">
    <h3 class="section__title" style="margin-bottom:8px;">Trigger Fetch</h3>
    <p class="muted">Throttle 1 job / 30 detik per admin.</p>
    <div class="cta-row" style="margin-top:10px;">
      <button class="btn" id="btnFetch" type="button">▶ Fetch YouTube &amp; Instagram</button>
      <a class="btnGhost" href="<?= esc($ytUrl) ?>" target="_blank" rel="noopener">Buka Channel YouTube</a>
      <a class="btnGhost" href="<?= esc($igUrl) ?>" target="_blank" rel="noopener">Buka Profil IG</a>
    </div>
    <div id="fetchStatus" style="margin-top:12px;"></div>
  </div>

  <div class="panel">
    <h3 class="section__title" style="margin-bottom:8px;">10 Job Terakhir</h3>
    <?php if (empty($jobs)): ?>
      <div class="muted">Belum ada job.</div>
    <?php else: ?>
      <table class="table">
        <thead>
          <tr>
            <th>#</th><th>Status</th><th>YT</th><th>IG</th>
            <th>Mulai</th><th>Selesai</th><th>Pesan</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($jobs as $j): ?>
            <tr>
              <td>#<?= (int) $j['id'] ?></td>
              <td><span class="pill status-<?= esc(strtolower($j['status'])) ?>"><?= esc($j['status']) ?></span></td>
              <td><?= (int)($j['items_youtube'] ?? 0) ?></td>
              <td><?= (int)($j['items_instagram'] ?? 0) ?></td>
              <td><?= esc($j['started_at'] ?? '-') ?></td>
              <td><?= esc($j['finished_at'] ?? '-') ?></td>
              <td><small class="muted"><?= esc($j['message'] ?? '-') ?></small></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </div>

  <div class="panel">
    <h3 class="section__title" style="margin-bottom:8px;">Cache Terbaru (24 item)</h3>
    <?php if (empty($posts)): ?>
      <div class="muted">Cache masih kosong. Tekan tombol fetch di atas.</div>
    <?php else: ?>
      <div class="grid">
        <?php foreach ($posts as $p): ?>
          <div class="porto-card">
            <div class="porto-card__img" style="background-image:url('<?= esc($p['thumbnail_url'] ?? '') ?>');"></div>
            <div class="porto-card__body">
              <div class="porto-card__meta"><?= esc($p['platform']) ?> • <?= esc($p['type'] ?? '-') ?></div>
              <div class="porto-card__title"><?= esc($p['title'] ?: ($p['caption'] ?: '—')) ?></div>
              <div class="muted" style="font-size:12px;margin-top:6px;"><?= esc($p['posted_at'] ?? '-') ?></div>
              <div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">
                <a class="link" target="_blank" href="<?= esc($p['permalink'] ?? '#') ?>">Buka</a>
                <form method="post" action="<?= site_url('admin/social/feature/' . (int)$p['id']) ?>" style="display:inline;">
                  <?= csrf_field() ?>
                  <button class="btn-ghost" type="submit" style="padding:4px 10px;font-size:12px;">
                    <?= ! empty($p['is_featured']) ? '★ Featured' : '☆ Feature' ?>
                  </button>
                </form>
              </div>
            </div>
          </div>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</div>

<script>
(function() {
  const btn = document.getElementById('btnFetch');
  const out = document.getElementById('fetchStatus');
  if (!btn) return;

  btn.addEventListener('click', async function() {
    btn.disabled = true; btn.textContent = '...';
    out.innerHTML = '<div class="muted">Membuat job...</div>';

    try {
      const form = new FormData();
      form.append('<?= csrf_header() ?>', '<?= csrf_hash() ?>');
      const r = await fetch('<?= site_url('admin/social/fetch') ?>', {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
      });
      const j = await r.json();
      if (!j.ok) {
        out.innerHTML = '<div class="alert error">' + (j.error || 'Gagal') + '</div>';
        btn.disabled = false; btn.textContent = '▶ Fetch YouTube & Instagram';
        return;
      }
      poll(j.jobId);
    } catch (e) {
      out.innerHTML = '<div class="alert error">' + e + '</div>';
      btn.disabled = false; btn.textContent = '▶ Fetch YouTube & Instagram';
    }
  });

  async function poll(jobId) {
    let attempts = 0;
    const tick = async () => {
      attempts++;
      try {
        const r = await fetch('<?= site_url('admin/social/status/') ?>' + jobId, { credentials: 'same-origin' });
        const j = await r.json();
        if (j.ok && j.job) {
          const st = j.job.status;
          out.innerHTML = '<div class="muted">Job #' + jobId + ' — <b>' + st + '</b> (YT: ' + (j.job.items_youtube||0) + ', IG: ' + (j.job.items_instagram||0) + ')</div>';
          if (st === 'done' || st === 'failed') {
            if (st === 'failed' && j.job.message) {
              out.innerHTML += '<div class="alert error">' + j.job.message + '</div>';
            }
            btn.disabled = false; btn.textContent = '▶ Fetch YouTube & Instagram';
            setTimeout(() => location.reload(), 1500);
            return;
          }
        }
      } catch (_) {}
      if (attempts < 60) setTimeout(tick, 3000);
    };
    tick();
  }
})();
</script>

<?= $this->endSection() ?>
