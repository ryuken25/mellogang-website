<?= $this->extend('layout/main') ?>
<?= $this->section('content') ?>

<div class="container">
  <h2 class="section__title">Upload Pembayaran</h2>

  <?php if (session()->getFlashdata('error')): ?>
    <div class="alert error"><?= esc(session()->getFlashdata('error')) ?></div>
  <?php endif; ?>
  <?php if (session()->getFlashdata('success')): ?>
    <div class="alert ok"><?= esc(session()->getFlashdata('success')) ?></div>
  <?php endif; ?>

  <div class="panel" style="margin-top:12px;">
    <div class="muted" style="margin-bottom:10px;">
      Kode Pesanan: <b><?= esc($order['kode_pemesanan']) ?></b>
      <div>Total: <b>Rp <?= number_format((int)$total,0,',','.') ?></b></div>
      <div>Sudah valid: <b>Rp <?= number_format((int)$totalValid,0,',','.') ?></b></div>
      <div>Sisa: <b>Rp <?= number_format((int)$sisa,0,',','.') ?></b></div>
      <div>DP (50%): <b>Rp <?= number_format((int)$dpDue,0,',','.') ?></b></div>
    </div>

    <?php if (!empty($snapEnabled)): ?>
    <!-- ===== Bayar Otomatis (Midtrans Snap) ===== -->
    <div class="panel" style="margin-bottom:12px;border:1px solid rgba(0,245,184,.35);">
      <div style="font-weight:700;margin-bottom:6px;">Bayar Otomatis (QRIS / e-Wallet / Virtual Account)</div>
      <div class="muted" style="margin-bottom:10px;">
        Bayar instan via Midtrans — status terverifikasi otomatis, tanpa upload bukti.
      </div>
      <div class="row" style="align-items:flex-end;">
        <div>
          <div class="label">Jenis Pembayaran</div>
          <select class="input" id="snap_jenis">
            <?php if ($allowDP): ?>
              <option value="DP">DP (50%) — Rp <?= number_format((int)$dpDue,0,',','.') ?></option>
            <?php endif; ?>
            <option value="Pelunasan"><?= $allowDP ? 'Pelunasan (Full)' : 'Pelunasan (Sisa)' ?> — Rp <?= number_format((int)$pelunasanDue,0,',','.') ?></option>
          </select>
        </div>
        <div>
          <button class="btnPrimary" type="button" id="btnSnapPay">Bayar Sekarang</button>
        </div>
      </div>
      <div id="snapStatus" class="muted" style="margin-top:8px;"></div>
    </div>

    <div class="muted" style="text-align:center;margin:8px 0;">— atau transfer manual + upload bukti —</div>
    <?php endif; ?>

    <div class="panel" style="background:#fafafa;margin-bottom:12px;">
      <div style="font-weight:700;margin-bottom:6px;">Instruksi Pembayaran</div>
      <div class="muted" style="margin-bottom:8px;">
        Transfer Pembayaran ke rekening berikut A/N: <b>I KADEK DARMADI</b>
      </div>
      <ul style="margin:0;padding-left:18px;">
        <li>BCA: <b>7680513222</b></li>
        <li>MANDIRI: <b>1450015365766</b></li>
        <li>BNI: <b>0695785189</b></li>
        <li>BRI: <b>477401009136504</b></li>
        <li>BPD BALI: <b>0100202547258</b></li>
        <li>SEABANK: <b>901081603711</b></li>
      </ul>
      <div class="muted" style="margin-top:8px;">
        E-Wallet (OVO/DANA/ShopeePay) ke: <b>082236004917</b>
      </div>
    </div>

    <form method="post" enctype="multipart/form-data" action="<?= site_url('pelanggan/pembayaran/upload/'.$order['id_pemesanan']) ?>">
      <?= csrf_field() ?>

      <div class="row">
        <div>
          <div class="label">Jenis Pembayaran</div>
          <select class="input" id="jenis_pembayaran" name="jenis_pembayaran" required>
            <?php if ($allowDP): ?>
              <option value="DP">DP (50%)</option>
            <?php endif; ?>
            <option value="Pelunasan"><?= $allowDP ? 'Pelunasan (Full)' : 'Pelunasan (Sisa)' ?></option>
          </select>
          <?php if (!$allowDP): ?>
            <small class="muted">DP sudah valid, jadi sekarang upload Pelunasan (sisa).</small>
          <?php endif; ?>
        </div>

        <div>
          <div class="label">Metode Pembayaran</div>
          <select class="input" name="metode_pembayaran" required>
            <option value="">-- pilih metode --</option>
            <option value="BCA">Transfer BCA</option>
            <option value="MANDIRI">Transfer Mandiri</option>
            <option value="BNI">Transfer BNI</option>
            <option value="BRI">Transfer BRI</option>
            <option value="BPD BALI">Transfer BPD Bali</option>
            <option value="SEABANK">Transfer Seabank</option>
            <option value="E-Wallet (OVO/DANA/ShopeePay)">E-Wallet (OVO/DANA/ShopeePay)</option>
            <option value="Tunai">Tunai</option>
          </select>
        </div>
      </div>

      <div class="row">
        <div>
          <div class="label">Jumlah Bayar</div>

          <!-- angka murni untuk backend -->
          <input type="hidden" id="jumlah_bayar" name="jumlah_bayar"
                 value="<?= (int)($allowDP ? $dpDue : $pelunasanDue) ?>">

          <!-- tampilan Rp -->
          <input class="input" id="jumlah_bayar_display" type="text" readonly
                 value="Rp <?= number_format((int)($allowDP ? $dpDue : $pelunasanDue),0,',','.') ?>">

          <small class="muted">Jumlah otomatis sesuai DP/Pelunasan.</small>
        </div>

        <div>
          <div class="label">Bukti Bayar (JPG/PNG max 2MB)</div>
          <input class="input" type="file" name="bukti_bayar" accept="image/png,image/jpeg" required>
        </div>
      </div>

      <button class="btnPrimary" type="submit">Kirim</button>
      <a class="btnGhost" href="<?= site_url('pelanggan/pembayaran/riwayat/'.$order['id_pemesanan']) ?>">Lihat Riwayat</a>
    </form>
  </div>
</div>

<script>
(function(){
  const jenis = document.getElementById('jenis_pembayaran');
  const hidden = document.getElementById('jumlah_bayar');
  const display = document.getElementById('jumlah_bayar_display');

  const dpDue = <?= (int)$dpDue ?>;
  const pelunasanDue = <?= (int)$pelunasanDue ?>;

  function formatRp(n){
    return 'Rp ' + (n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function syncJumlah(){
    const val = (jenis && jenis.value === 'DP') ? dpDue : pelunasanDue;
    hidden.value = val;
    display.value = formatRp(val);
  }

  if (jenis) jenis.addEventListener('change', syncJumlah);
  syncJumlah();
})();
</script>

<?php if (!empty($snapEnabled)): ?>
<script src="<?= esc($snapJsUrl, 'attr') ?>" data-client-key="<?= esc($snapClientKey, 'attr') ?>"></script>
<script>
(function(){
  const btn = document.getElementById('btnSnapPay');
  const out = document.getElementById('snapStatus');
  if (!btn) return;

  const riwayatUrl = '<?= site_url('pelanggan/pembayaran/riwayat/'.$order['id_pemesanan']) ?>?pay=midtrans';

  btn.addEventListener('click', async function(){
    btn.disabled = true; btn.textContent = 'Memproses...';
    out.textContent = '';

    try {
      // Token dibaca live dari cookie CSRF — token embed jadi basi setelah
      // POST pertama (Security::$regenerate = true).
      const cookieTok = (document.cookie.match(/(?:^|;\s*)<?= config('Security')->cookieName ?>=([^;]+)/) || [])[1];
      const form = new FormData();
      form.append('<?= csrf_token() ?>', cookieTok || '<?= csrf_hash() ?>');
      form.append('jenis_pembayaran', document.getElementById('snap_jenis').value);

      const r = await fetch('<?= site_url('pelanggan/pembayaran/'.$order['id_pemesanan'].'/snap-token') ?>', {
        method: 'POST',
        body: form,
        credentials: 'same-origin',
      });
      const j = await r.json();

      if (!j.ok || !j.token) {
        out.textContent = j.error || 'Gagal membuat transaksi. Coba lagi.';
        btn.disabled = false; btn.textContent = 'Bayar Sekarang';
        return;
      }

      // PENTING: callback browser TIDAK menandai lunas — status final selalu
      // dari webhook. Redirect ke riwayat yang mem-polling status server.
      window.snap.pay(j.token, {
        onSuccess: function(){ window.location = riwayatUrl; },
        onPending: function(){ window.location = riwayatUrl; },
        onError:   function(){
          out.textContent = 'Pembayaran gagal. Coba lagi atau pakai transfer manual.';
          btn.disabled = false; btn.textContent = 'Bayar Sekarang';
        },
        onClose:   function(){
          btn.disabled = false; btn.textContent = 'Bayar Sekarang';
          out.textContent = 'Popup ditutup. Transaksi masih bisa dilanjutkan dari riwayat.';
        }
      });
    } catch (e) {
      out.textContent = 'Error: ' + e;
      btn.disabled = false; btn.textContent = 'Bayar Sekarang';
    }
  });
})();
</script>
<?php endif; ?>

<?= $this->endSection() ?>
