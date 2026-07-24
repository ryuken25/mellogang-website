<?php

namespace App\Controllers\Pelanggan;

use App\Controllers\BaseController;
use App\Services\MidtransService;
use App\Support\Status;

class PembayaranController extends BaseController
{
    private function guard()
    {
        if (!session()->get('logged_in')) return redirect()->to(site_url('login'));
        if (session()->get('role') !== 'pelanggan') return redirect()->to(site_url('/'));
        return null;
    }

    private function normStatus($s): string
    {
        return strtolower(trim((string)$s));
    }

    private function hitungRekap($db, int $idPemesanan): array
    {
        $rows = $db->table('pembayaran')
            ->select('jenis_pembayaran, status_verifikasi, jumlah_bayar')
            ->where('id_pemesanan', $idPemesanan)
            ->get()->getResultArray();

        $dpValid = 0;
        $totalValid = 0;
        $pendingCount = 0;

        foreach ($rows as $r) {
            $st = $this->normStatus($r['status_verifikasi'] ?? '');
            $jumlah = (int)($r['jumlah_bayar'] ?? 0);

            if ($st === 'menunggu') $pendingCount++;

            if ($st !== 'valid') continue;
            $totalValid += $jumlah;

            if (($r['jenis_pembayaran'] ?? '') === 'DP') {
                $dpValid += $jumlah;
            }
        }

        return [$dpValid, $totalValid, $pendingCount];
    }

    public function create($idPemesanan)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $order = $db->table('pemesanan')
            ->select('id_pemesanan,kode_pemesanan,id_user,total_biaya,status_pemesanan')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->get()->getRowArray();

        if (!$order || (int)$order['id_user'] !== $idUser) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Pesanan tidak ditemukan / bukan milik kamu.');
        }

        // Block pembayaran jika pesanan sudah batal atau ditolak
        $statusLower = strtolower(trim((string)($order['status_pemesanan'] ?? '')));
        if (in_array($statusLower, ['batal', 'ditolak'], true)) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Pesanan sudah dibatalkan. Tidak bisa melakukan pembayaran.');
        }

        $total = (int)($order['total_biaya'] ?? 0);
        $dpDue = (int) ceil($total * 0.5);

        [$dpValid, $totalValid, $pendingCount] = $this->hitungRekap($db, (int)$idPemesanan);
        $sisa = max(0, $total - $totalValid);

        // kalau ada yang menunggu, jangan upload lagi -> lihat riwayat
        if ($pendingCount > 0) {
            return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$order['id_pemesanan']))
                ->with('error', 'Masih ada pembayaran yang menunggu verifikasi. Cek riwayat dulu ya.');
        }

        $allowDP = ($dpValid <= 0);
        $pelunasanDue = $allowDP ? $total : $sisa;

        if ($sisa <= 0) {
            return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$order['id_pemesanan']))
                ->with('success', 'Pesanan sudah lunas.');
        }

        $midtransConfig = config('Midtrans');

        return view('pelanggan/pembayaran/upload', [
            'order'        => $order,
            'total'        => $total,
            'dpDue'        => $dpDue,
            'pelunasanDue' => $pelunasanDue,
            'dpValid'      => $dpValid,
            'totalValid'   => $totalValid,
            'sisa'         => $sisa,
            'allowDP'      => $allowDP,
            // Midtrans Snap (kosong = fitur otomatis disembunyikan)
            'snapEnabled'   => $midtransConfig->serverKey !== '' && $midtransConfig->clientKey !== '',
            'snapClientKey' => $midtransConfig->clientKey,
            'snapJsUrl'     => $midtransConfig->snapJsUrl(),
        ]);
    }

    public function store($idPemesanan)
    {
        if ($resp = $this->guard()) return $resp;

        $rules = [
            'jenis_pembayaran'  => 'required|in_list[DP,Pelunasan]',
            'metode_pembayaran' => 'required|max_length[50]',
            'jumlah_bayar'      => 'required|is_natural_no_zero',
            'bukti_bayar'       => 'uploaded[bukti_bayar]|max_size[bukti_bayar,2048]|ext_in[bukti_bayar,jpg,jpeg,png]|mime_in[bukti_bayar,image/jpg,image/jpeg,image/png]',
        ];

        if (!$this->validate($rules)) {
            return redirect()->back()->withInput()->with('error', 'Validasi gagal. Pastikan file JPG/PNG max 2MB.');
        }

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $order = $db->table('pemesanan')
            ->select('id_pemesanan,kode_pemesanan,id_user,total_biaya,status_pemesanan')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->get()->getRowArray();

        if (!$order || (int)$order['id_user'] !== $idUser) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Pesanan tidak ditemukan / bukan milik kamu.');
        }

        // Block pembayaran jika pesanan sudah batal atau ditolak
        $statusLower = strtolower(trim((string)($order['status_pemesanan'] ?? '')));
        if (in_array($statusLower, ['batal', 'ditolak'], true)) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Pesanan sudah dibatalkan. Tidak bisa melakukan pembayaran.');
        }

        $total = (int)($order['total_biaya'] ?? 0);
        $dpDue = (int) ceil($total * 0.5);

        [$dpValid, $totalValid, $pendingCount] = $this->hitungRekap($db, (int)$idPemesanan);
        $sisa = max(0, $total - $totalValid);

        if ($pendingCount > 0) {
            return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$order['id_pemesanan']))
                ->with('error', 'Masih ada pembayaran yang menunggu verifikasi. Cek riwayat dulu ya.');
        }

        $jenis  = $this->request->getPost('jenis_pembayaran');
        $metode = $this->request->getPost('metode_pembayaran');
        $jumlah = (int) $this->request->getPost('jumlah_bayar');

        // DP harus tepat 50%
        if ($jenis === 'DP') {
            if ($dpValid > 0) {
                return redirect()->back()->withInput()->with('error', 'DP sudah pernah dibayar & valid. Silakan pilih Pelunasan.');
            }
            if ($jumlah !== $dpDue) {
                return redirect()->back()->withInput()->with('error', 'Jumlah DP harus tepat 50%: Rp ' . number_format($dpDue,0,',','.'));
            }
        } else { // Pelunasan
            $expected = ($dpValid > 0) ? $sisa : $total; // sisa kalau DP valid, full kalau belum
            if ($jumlah !== $expected) {
                return redirect()->back()->withInput()->with('error', 'Jumlah Pelunasan harus Rp ' . number_format($expected,0,',','.') . '.');
            }
        }

        $file = $this->request->getFile('bukti_bayar');
        if (!$file || !$file->isValid()) {
            return redirect()->back()->withInput()->with('error', 'File upload tidak valid.');
        }

        $uploadPath = WRITEPATH . 'uploads/pembayaran';
        if (!is_dir($uploadPath)) mkdir($uploadPath, 0775, true);

        $ext = strtolower($file->getClientExtension());
        $newName = 'bukti_' . $order['kode_pemesanan'] . '_' . strtolower($jenis) . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $file->move($uploadPath, $newName);

        $db->table('pembayaran')->insert([
            'id_pemesanan'       => (int)$idPemesanan,
            'jenis_pembayaran'   => $jenis,
            'tanggal_bayar'      => date('Y-m-d H:i:s'),
            'metode_pembayaran'  => $metode,
            'jumlah_bayar'       => $jumlah,
            'bukti_bayar'        => $newName,
            'status_verifikasi'  => Status::VERIF_MENUNGGU,
            'catatan_verifikasi' => null,
            'gateway'            => 'manual',
        ]);

        return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$order['id_pemesanan']))
            ->with('success', 'Bukti pembayaran terkirim. Menunggu verifikasi admin.');
    }

    public function riwayat($idPemesanan)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $order = $db->table('pemesanan')
            ->select('id_pemesanan,kode_pemesanan,id_user,total_biaya')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->get()->getRowArray();

        if (!$order || (int)$order['id_user'] !== $idUser) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Pesanan tidak ditemukan / bukan milik kamu.');
        }

        $rows = $db->table('pembayaran')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->orderBy('id_pembayaran', 'DESC')
            ->get()->getResultArray();

        $total = (int)($order['total_biaya'] ?? 0);

        $valid = 0;
        $dpValid = 0;
        $pendingCount = 0;

        foreach ($rows as $r) {
            $st = $this->normStatus($r['status_verifikasi'] ?? '');
            if ($st === 'menunggu') $pendingCount++;

            if ($st === 'valid') {
                $valid += (int)$r['jumlah_bayar'];
                if (($r['jenis_pembayaran'] ?? '') === 'DP') $dpValid += (int)$r['jumlah_bayar'];
            }
        }

        $sisa = max(0, $total - $valid);

        return view('pelanggan/pembayaran/riwayat', [
            'order'        => $order,
            'rows'         => $rows,
            'total'        => $total,
            'valid'        => $valid,
            'sisa'         => $sisa,
            'dpValid'      => $dpValid,
            'pendingCount' => $pendingCount,
        ]);
    }

    // preview bukti (inline) untuk pelanggan pemilik pesanan
    public function file($idPembayaran)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $row = $db->table('pembayaran p')
            ->select('p.bukti_bayar, pm.id_user')
            ->join('pemesanan pm', 'pm.id_pemesanan = p.id_pemesanan', 'left')
            ->where('p.id_pembayaran', (int)$idPembayaran)
            ->get()->getRowArray();

        if (!$row || empty($row['bukti_bayar']) || (int)$row['id_user'] !== $idUser) {
            return redirect()->back()->with('error', 'File tidak ditemukan / akses ditolak.');
        }

        $filename = basename($row['bukti_bayar']);
        $path = WRITEPATH . 'uploads/pembayaran/' . $filename;

        if (!is_file($path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan di server.');
        }

        $mime = @mime_content_type($path) ?: 'image/jpeg';
        return $this->response->setContentType($mime)->setBody(file_get_contents($path));
    }

    // ====== MIDTRANS SNAP (pembayaran otomatis) ======

    /**
     * POST /pelanggan/pembayaran/{idPemesanan}/snap-token
     * Body: jenis_pembayaran=DP|Pelunasan. CSRF ON (dipanggil dari halaman CI4).
     * Return: {ok, token, order_id}. Webhook yang menentukan status — bukan
     * callback browser.
     */
    public function snapToken($idPemesanan)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $order = $db->table('pemesanan')
            ->select('id_pemesanan,kode_pemesanan,id_user,total_biaya,status_pemesanan')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->get()->getRowArray();

        // Ownership check: hanya pemesanan milik sendiri.
        if (!$order || (int)$order['id_user'] !== $idUser) {
            return $this->response->setStatusCode(404)->setJSON(['ok' => false, 'error' => 'Pesanan tidak ditemukan / bukan milik kamu.']);
        }

        $statusLower = strtolower(trim((string)($order['status_pemesanan'] ?? '')));
        if (in_array($statusLower, [Status::ORDER_BATAL, Status::ORDER_DITOLAK], true)) {
            return $this->response->setStatusCode(422)->setJSON(['ok' => false, 'error' => 'Pesanan sudah dibatalkan.']);
        }

        $jenis = (string) $this->request->getPost('jenis_pembayaran');
        if (!in_array($jenis, ['DP', 'Pelunasan'], true)) {
            return $this->response->setStatusCode(422)->setJSON(['ok' => false, 'error' => 'jenis_pembayaran harus DP atau Pelunasan.']);
        }

        $total = (int)($order['total_biaya'] ?? 0);
        $dpDue = (int) ceil($total * 0.5);
        [$dpValid, $totalValid, $pendingCount] = $this->hitungRekap($db, (int)$idPemesanan);
        $sisa = max(0, $total - $totalValid);

        if ($sisa <= 0) {
            return $this->response->setStatusCode(422)->setJSON(['ok' => false, 'error' => 'Pesanan sudah lunas.']);
        }

        // Nominal mengikuti aturan flow manual: DP = 50%, Pelunasan = sisa/full.
        if ($jenis === 'DP') {
            if ($dpValid > 0) {
                return $this->response->setStatusCode(422)->setJSON(['ok' => false, 'error' => 'DP sudah valid. Pilih Pelunasan.']);
            }
            $amount = $dpDue;
        } else {
            $amount = ($dpValid > 0) ? $sisa : $total;
        }

        $midtrans = new MidtransService();

        // Reuse token: masih ada transaksi midtrans menunggu dengan nominal sama.
        $existing = $db->table('pembayaran')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->where('gateway', 'midtrans')
            ->where('status_verifikasi', Status::VERIF_MENUNGGU)
            ->where('jumlah_bayar', $amount)
            ->orderBy('id_pembayaran', 'DESC')
            ->get()->getRowArray();

        if ($existing && !empty($existing['snap_token'])) {
            return $this->response->setJSON([
                'ok'       => true,
                'token'    => $existing['snap_token'],
                'order_id' => $existing['midtrans_order_id'],
                'reused'   => true,
            ]);
        }

        // Kalau masih ada upload manual yang menunggu, jangan dobel jalur.
        if ($pendingCount > 0) {
            return $this->response->setStatusCode(422)->setJSON(['ok' => false, 'error' => 'Masih ada pembayaran manual menunggu verifikasi.']);
        }

        $orderId = $midtrans->buildOrderId((int)$idPemesanan);

        $user = $db->table('user')
            ->select('nama_lengkap, email, no_telepon')
            ->where('id_user', $idUser)
            ->get()->getRowArray() ?? [];

        $detail = $db->table('detail_pemesanan')
            ->select('nama_item')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->get()->getRowArray();

        // item_details HARUS berjumlah = gross_amount; representasikan sebagai
        // satu line item DP/Pelunasan supaya selalu konsisten.
        $label = $jenis === 'DP' ? 'DP 50% ' : 'Pelunasan ';
        $itemDetails = [[
            'id'       => 'PAY-' . $order['kode_pemesanan'],
            'price'    => $amount,
            'quantity' => 1,
            'name'     => substr($label . ($detail['nama_item'] ?? 'Paket') . ' (' . $order['kode_pemesanan'] . ')', 0, 50),
        ]];

        try {
            $token = $midtrans->createSnapTransaction($orderId, $amount, [
                'first_name' => (string)($user['nama_lengkap'] ?? 'Pelanggan'),
                'email'      => (string)($user['email'] ?? ''),
                'phone'      => (string)($user['no_telepon'] ?? ''),
            ], $itemDetails);
        } catch (\Throwable $e) {
            log_message('error', 'Snap token gagal: {msg}', ['msg' => $e->getMessage()]);
            return $this->response->setStatusCode(502)->setJSON(['ok' => false, 'error' => 'Gagal membuat transaksi Midtrans. Coba lagi.']);
        }

        $db->table('pembayaran')->insert([
            'id_pemesanan'       => (int)$idPemesanan,
            'jenis_pembayaran'   => $jenis,
            'tanggal_bayar'      => null,
            'metode_pembayaran'  => 'Midtrans',
            'jumlah_bayar'       => $amount,
            'bukti_bayar'        => null,
            'status_verifikasi'  => Status::VERIF_MENUNGGU,
            'catatan_verifikasi' => null,
            'gateway'            => 'midtrans',
            'midtrans_order_id'  => $orderId,
            'snap_token'         => $token,
            'gross_amount'       => $amount,
        ]);

        return $this->response->setJSON(['ok' => true, 'token' => $token, 'order_id' => $orderId]);
    }

    /**
     * GET /pelanggan/pembayaran/{idPemesanan}/status — polling setelah Snap
     * popup ditutup. State hanya berubah lewat webhook.
     */
    public function status($idPemesanan)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $order = $db->table('pemesanan')
            ->select('id_pemesanan,id_user,status_pemesanan,total_biaya')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->get()->getRowArray();

        if (!$order || (int)$order['id_user'] !== $idUser) {
            return $this->response->setStatusCode(404)->setJSON(['ok' => false, 'error' => 'not_found']);
        }

        [$dpValid, $totalValid] = $this->hitungRekap($db, (int)$idPemesanan);

        $payments = $db->table('pembayaran')
            ->select('id_pembayaran, jenis_pembayaran, jumlah_bayar, status_verifikasi, gateway, transaction_status, payment_type, paid_at')
            ->where('id_pemesanan', (int)$idPemesanan)
            ->orderBy('id_pembayaran', 'DESC')
            ->get()->getResultArray();

        return $this->response->setJSON([
            'ok'               => true,
            'status_pemesanan' => $order['status_pemesanan'],
            'total_biaya'      => (int)$order['total_biaya'],
            'total_valid'      => $totalValid,
            'sisa'             => max(0, (int)$order['total_biaya'] - $totalValid),
            'payments'         => $payments,
        ]);
    }

    // ====== GANTI / REPLACE BUKTI ======

    public function edit($idPembayaran)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $row = $db->table('pembayaran p')
            ->select('p.*, pm.kode_pemesanan, pm.id_user')
            ->join('pemesanan pm', 'pm.id_pemesanan = p.id_pemesanan', 'left')
            ->where('p.id_pembayaran', (int)$idPembayaran)
            ->get()->getRowArray();

        if (!$row || (int)$row['id_user'] !== $idUser) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Data pembayaran tidak ditemukan / bukan milik kamu.');
        }

        $st = $this->normStatus($row['status_verifikasi'] ?? '');
        if (!in_array($st, ['menunggu','ditolak'], true)) {
            return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$row['id_pemesanan']))
                ->with('error', 'Bukti tidak bisa diganti karena sudah diverifikasi.');
        }

        return view('pelanggan/pembayaran/ganti', ['row' => $row]);
    }

    public function update($idPembayaran)
    {
        if ($resp = $this->guard()) return $resp;

        $rules = [
            'bukti_bayar' => 'uploaded[bukti_bayar]|max_size[bukti_bayar,2048]|ext_in[bukti_bayar,jpg,jpeg,png]|mime_in[bukti_bayar,image/jpg,image/jpeg,image/png]',
        ];
        if (!$this->validate($rules)) {
            return redirect()->back()->withInput()->with('error', 'Validasi gagal. File harus JPG/PNG max 2MB.');
        }

        $db = db_connect();
        $idUser = (int) session()->get('id_user');

        $row = $db->table('pembayaran p')
            ->select('p.*, pm.kode_pemesanan, pm.id_user')
            ->join('pemesanan pm', 'pm.id_pemesanan = p.id_pemesanan', 'left')
            ->where('p.id_pembayaran', (int)$idPembayaran)
            ->get()->getRowArray();

        if (!$row || (int)$row['id_user'] !== $idUser) {
            return redirect()->to(site_url('status-pesanan'))
                ->with('error', 'Data pembayaran tidak ditemukan / bukan milik kamu.');
        }

        $st = $this->normStatus($row['status_verifikasi'] ?? '');
        if (!in_array($st, ['menunggu','ditolak'], true)) {
            return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$row['id_pemesanan']))
                ->with('error', 'Bukti tidak bisa diganti karena sudah diverifikasi.');
        }

        $file = $this->request->getFile('bukti_bayar');
        if (!$file || !$file->isValid()) {
            return redirect()->back()->with('error', 'File upload tidak valid.');
        }

        $uploadPath = WRITEPATH . 'uploads/pembayaran';
        if (!is_dir($uploadPath)) mkdir($uploadPath, 0775, true);

        $ext = strtolower($file->getClientExtension());
        $newName = 'bukti_' . ($row['kode_pemesanan'] ?? 'MLG') . '_' . strtolower($row['jenis_pembayaran'] ?? 'bayar') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

        $file->move($uploadPath, $newName);

        // hapus file lama
        if (!empty($row['bukti_bayar'])) {
            $oldPath = $uploadPath . '/' . basename($row['bukti_bayar']);
            if (is_file($oldPath)) @unlink($oldPath);
        }

        $db->table('pembayaran')->where('id_pembayaran', (int)$idPembayaran)->update([
            'bukti_bayar'        => $newName,
            'tanggal_bayar'      => date('Y-m-d H:i:s'),
            'status_verifikasi'  => Status::VERIF_MENUNGGU,
            'catatan_verifikasi' => null,
        ]);

        return redirect()->to(site_url('pelanggan/pembayaran/riwayat/'.$row['id_pemesanan']))
            ->with('success', 'Bukti pembayaran berhasil diganti. Menunggu verifikasi admin.');
    }
}
