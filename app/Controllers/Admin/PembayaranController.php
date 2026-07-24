<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Services\PembayaranService;
use App\Support\Status;

class PembayaranController extends BaseController
{
    private function normStatus($s): string
    {
        return strtolower(trim((string)$s));
    }

    public function index()
    {
        $db = db_connect();
        $status = $this->request->getGet('status'); // menunggu|valid|ditolak|all

        $q = $db->table('pembayaran p')
            ->select('p.id_pembayaran, p.id_pemesanan, p.jenis_pembayaran, p.tanggal_bayar, p.metode_pembayaran, p.jumlah_bayar, p.bukti_bayar, p.status_verifikasi,
                      p.gateway, p.transaction_status, p.payment_type,
                      pm.kode_pemesanan, pm.total_biaya,
                      u.nama_lengkap')
            ->join('pemesanan pm', 'pm.id_pemesanan = p.id_pemesanan', 'left')
            ->join('user u', 'u.id_user = pm.id_user', 'left')
            ->orderBy('p.id_pembayaran', 'DESC');

        if ($status && strtolower($status) !== 'all') {
            // Status sudah kanonik lowercase (migration NormalizeStatusValues)
            // — filter langsung, tanpa LOWER() raw (lihat bugging.md).
            $q->where('p.status_verifikasi', strtolower($status));
        }

        $rows = $q->get()->getResultArray();

        return view('admin/pembayaran/index', [
            'title'  => 'Pembayaran',
            'rows'   => $rows,
            'status' => $status,
        ]);
    }

    public function verifyForm($idPembayaran)
    {
        $db = db_connect();

        $row = $db->table('pembayaran p')
            ->select('p.*, pm.kode_pemesanan, pm.total_biaya, pm.status_pemesanan, u.nama_lengkap')
            ->join('pemesanan pm', 'pm.id_pemesanan = p.id_pemesanan', 'left')
            ->join('user u', 'u.id_user = pm.id_user', 'left')
            ->where('p.id_pembayaran', (int)$idPembayaran)
            ->get()->getRowArray();

        if (!$row) {
            return redirect()->to(site_url('admin/pembayaran'))->with('error', 'Data pembayaran tidak ditemukan.');
        }

        return view('admin/pembayaran/verify', [
            'title' => 'Verifikasi Pembayaran',
            'row'   => $row,
        ]);
    }

    public function verify($idPembayaran)
    {
        $db = db_connect();

        $status = $this->normStatus($this->request->getPost('status_verifikasi'));
        $catatan = (string)$this->request->getPost('catatan_verifikasi');

        if (!in_array($status, ['menunggu', 'valid', 'ditolak'], true)) {
            return redirect()->back()->with('error', 'Status tidak valid.');
        }

        $row = $db->table('pembayaran')->where('id_pembayaran', (int)$idPembayaran)->get()->getRowArray();
        if (!$row) {
            return redirect()->to(site_url('admin/pembayaran'))->with('error', 'Data pembayaran tidak ditemukan.');
        }

        // Pembayaran Midtrans yang sudah valid = read-only. Webhook adalah
        // satu-satunya sumber kebenaran untuk gateway otomatis.
        $isMidtrans = ($row['gateway'] ?? 'manual') === 'midtrans';
        $curVerif   = $this->normStatus($row['status_verifikasi'] ?? '');
        if ($isMidtrans && $curVerif === Status::VERIF_VALID) {
            return redirect()->to(site_url('admin/pembayaran/verify/'.$idPembayaran))
                ->with('error', 'Pembayaran Midtrans sudah settle — tidak bisa diubah manual.');
        }

        // Simpan kanonik lowercase (menunggu|valid|ditolak) — lihat App\Support\Status.
        $db->table('pembayaran')->where('id_pembayaran', (int)$idPembayaran)->update([
            'status_verifikasi'  => $status,
            'catatan_verifikasi' => $catatan,
        ]);

        // Update status pemesanan lewat domain logic bersama (dipakai juga
        // webhook Midtrans). Logika lama inline di sini memakai status
        // ber-spasi — dead code sejak normalisasi snake_case.
        (new PembayaranService())->recalcOrderStatus((int)($row['id_pemesanan'] ?? 0));

        return redirect()->to(site_url('admin/pembayaran/verify/'.$idPembayaran))
            ->with('success', 'Verifikasi tersimpan.');
    }

    /**
     * Preview/Download bukti bayar by id_pembayaran
     * - default: inline (preview)
     * - download pakai ?download=1
     */
    public function file($idPembayaran)
    {
        $db = db_connect();

        $row = $db->table('pembayaran p')
            ->select('p.id_pembayaran, p.bukti_bayar, p.jenis_pembayaran, pm.kode_pemesanan')
            ->join('pemesanan pm', 'pm.id_pemesanan = p.id_pemesanan', 'left')
            ->where('p.id_pembayaran', (int)$idPembayaran)
            ->get()->getRowArray();

        if (!$row || empty($row['bukti_bayar'])) {
            return redirect()->back()->with('error', 'Bukti bayar tidak ditemukan.');
        }

        $filename = basename((string)$row['bukti_bayar']);
        $path = WRITEPATH . 'uploads/pembayaran/' . $filename;

        if (!is_file($path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan di server.');
        }

        $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
        $mime = 'application/octet-stream';
        if (in_array($ext, ['jpg', 'jpeg'], true)) $mime = 'image/jpeg';
        if ($ext === 'png') $mime = 'image/png';
        if ($ext === 'webp') $mime = 'image/webp';
        if ($ext === 'pdf') $mime = 'application/pdf';

        $downloadName = 'bukti-' . ($row['kode_pemesanan'] ?? 'pembayaran') . '-' . strtolower($row['jenis_pembayaran'] ?? 'bayar') . '.' . $ext;

        $download = (int)($this->request->getGet('download') ?? 0) === 1;
        $disposition = $download ? 'attachment' : 'inline';

        return $this->response
            ->setHeader('Content-Type', $mime)
            ->setHeader('Content-Disposition', $disposition . '; filename="' . $downloadName . '"')
            ->setBody(file_get_contents($path));
    }
}
