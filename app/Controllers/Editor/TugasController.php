<?php

namespace App\Controllers\Editor;

use App\Controllers\BaseController;
use App\Libraries\Mailer;
use App\Libraries\ResultNotifier;
use App\Support\Status;

class TugasController extends BaseController
{
    private function guard()
    {
        if (!session()->get('logged_in')) return redirect()->to(site_url('login'));
        if (session()->get('role') !== 'editor') return redirect()->to(site_url('/'));
        return null;
    }

    private function allowedNext(string $current): array
    {
        return Status::prodTransitions()[$current] ?? [];
    }

    private function isEditingStatus(string $status): bool
    {
        $status = strtolower(trim($status));
        return in_array($status, [
            Status::PROD_CUT_TO_CUT, Status::PROD_FINISHING, Status::PROD_DONE,
            Status::PROD_REVISI, Status::PROD_REVISI_SELESAI,
        ], true);
    }

    /** hitung jumlah "REVISI: ..." di catatan_pelanggan */
    private function countRevisi(string $catatanPelanggan): int
    {
        if (trim($catatanPelanggan) === '') return 0;
        preg_match_all('~\bREVISI\s*:\s*~i', $catatanPelanggan, $m);
        return (int)count($m[0] ?? []);
    }

    private function paymentSnapshot($db, int $idPemesanan): array
    {
        $order = $db->table('pemesanan')->select('total_biaya,status_pemesanan')->where('id_pemesanan', $idPemesanan)->get()->getRowArray();
        $totalOrder = (int)($order['total_biaya'] ?? 0);

        $totalValid = 0;
        $dpValid = 0;

        $payRows = $db->table('pembayaran')
            ->select('jenis_pembayaran,jumlah_bayar,status_verifikasi')
            ->where('id_pemesanan', $idPemesanan)
            ->get()->getResultArray();

        foreach ($payRows as $p) {
            $st = strtolower((string)($p['status_verifikasi'] ?? ''));
            if ($st !== Status::VERIF_VALID) continue;
            $totalValid += (int)($p['jumlah_bayar'] ?? 0);
            if (strtolower((string)($p['jenis_pembayaran'] ?? '')) === 'dp') {
                $dpValid += (int)($p['jumlah_bayar'] ?? 0);
            }
        }

        $isLunas = ($totalOrder > 0 && $totalValid >= $totalOrder);
        $hasDp = ($dpValid > 0);

        return [
            'totalOrder' => $totalOrder,
            'totalValid' => $totalValid,
            'dpValid'    => $dpValid,
            'isLunas'    => $isLunas,
            'hasDp'      => $hasDp,
            'statusNow'  => strtolower((string)($order['status_pemesanan'] ?? '')),
        ];
    }

    private function restoreOrderStatusAfterRevisi($db, int $idPemesanan): string
    {
        $snap = $this->paymentSnapshot($db, $idPemesanan);
        $now = $snap['statusNow'];

        if (str_contains($now, 'serah terima') || $now === 'selesai') {
            return $now;
        }
        if ($snap['isLunas']) return Status::ORDER_LUNAS;
        if ($snap['hasDp']) return Status::ORDER_MENUNGGU_PELUNASAN;
        return Status::ORDER_MENUNGGU_PEMBAYARAN;
    }

    public function index()
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idEditor = (int) session()->get('id_user');
        $status = strtolower(trim((string) $this->request->getGet('status')));

        $q = $db->table('jadwal_produksi j')
            ->select("
                j.id_jadwal, j.status_produksi, j.tanggal_mulai_editing, j.tanggal_selesai_editing,
                pm.kode_pemesanan, pm.tanggal_acara, pm.lokasi_acara, pm.status_pemesanan,
                pk.nama_paket,
                u.nama_lengkap AS nama_pelanggan
            ")
            ->join('pemesanan pm', 'pm.id_pemesanan = j.id_pemesanan', 'left')
            ->join('paket pk', 'pk.id_paket = pm.id_paket', 'left')
            ->join('user u', 'u.id_user = pm.id_user', 'left')
            ->where('j.id_editor', $idEditor)
            ->orderBy('j.id_jadwal', 'DESC');

        if ($status !== '') {
            $q->where('j.status_produksi', $status);
        }

        $rows = $q->get()->getResultArray();

        return view('editor/tugas/index', [
            'title' => 'Tugas Editor',
            'rows'  => $rows,
            'status'=> $status,
        ]);
    }

    public function show($idJadwal)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idEditor = (int) session()->get('id_user');

        $job = $db->table('jadwal_produksi j')
            ->select("
                j.*,
                pm.kode_pemesanan, pm.tanggal_acara, pm.lokasi_acara, pm.catatan_pelanggan, pm.status_pemesanan,
                pm.id_pemesanan,
                pk.nama_paket, pk.kategori,
                u.nama_lengkap AS nama_pelanggan, u.email, u.no_telepon
            ")
            ->join('pemesanan pm', 'pm.id_pemesanan = j.id_pemesanan', 'left')
            ->join('paket pk', 'pk.id_paket = pm.id_paket', 'left')
            ->join('user u', 'u.id_user = pm.id_user', 'left')
            ->where('j.id_jadwal', (int)$idJadwal)
            ->get()->getRowArray();

        if (!$job || (int)$job['id_editor'] !== $idEditor) {
            return redirect()->to(site_url('editor/tugas'))->with('error', 'Tugas tidak ditemukan / bukan milik kamu.');
        }

        $statusNow = strtolower((string)($job['status_produksi'] ?? ''));
        $statusPesanan = strtolower((string)($job['status_pemesanan'] ?? ''));

        $revPending = ($statusPesanan === Status::ORDER_REVISI_PELANGGAN);
        $revProcess = ($statusPesanan === Status::ORDER_REVISI_DIPROSES);

        $canAcceptReject = $revPending && in_array($statusNow, [Status::PROD_DONE, Status::PROD_REVISI_SELESAI], true);

        $next = $this->allowedNext($statusNow);
        $canEdit = !empty($next);

        $files = [];
        $dir = WRITEPATH . 'uploads/progres/' . (int)$idJadwal;
        if (is_dir($dir)) {
            foreach (scandir($dir) as $f) {
                if ($f === '.' || $f === '..') continue;
                $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
                if (!in_array($ext, ['jpg','jpeg','png','pdf'], true)) continue;
                $files[] = $f;
            }
        }

        return view('editor/tugas/show', [
            'title' => 'Detail Tugas',
            'job' => $job,
            'canEdit' => $canEdit,
            'nextOptions' => $next,
            'files' => $files,
            'statusNow' => $statusNow,
            'revPending' => $revPending,
            'revProcess' => $revProcess,
            'canAcceptReject' => $canAcceptReject,
        ]);
    }

    public function acceptRevisi($idJadwal)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idEditor = (int) session()->get('id_user');

        $job = $db->table('jadwal_produksi j')
            ->select('j.id_jadwal,j.id_editor,j.id_pemesanan,j.status_produksi,j.catatan_produksi, pm.status_pemesanan, pm.catatan_pelanggan')
            ->join('pemesanan pm', 'pm.id_pemesanan = j.id_pemesanan', 'left')
            ->where('j.id_jadwal', (int)$idJadwal)
            ->get()->getRowArray();

        if (!$job || (int)$job['id_editor'] !== $idEditor) {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        $statusNow = strtolower((string)($job['status_produksi'] ?? ''));
        $statusPesanan = strtolower((string)($job['status_pemesanan'] ?? ''));

        if ($statusPesanan !== Status::ORDER_REVISI_PELANGGAN) {
            return redirect()->back()->with('error', 'Tidak ada request revisi yang pending.');
        }
        if (!in_array($statusNow, [Status::PROD_DONE, Status::PROD_REVISI_SELESAI], true)) {
            return redirect()->back()->with('error', 'Revisi hanya bisa diterima saat status produksi DONE / REVISI SELESAI.');
        }

        $now = date('Y-m-d H:i:s');

        $oldLog = trim((string)($job['catatan_produksi'] ?? ''));
        $line = "[{$now}] EDITOR: accept revisi";
        $newLog = trim($oldLog . "\n" . $line);

        $db->table('jadwal_produksi')->where('id_jadwal', (int)$idJadwal)->update([
            'status_produksi'  => Status::PROD_REVISI,
            'catatan_produksi' => $newLog,
        ]);

        $db->table('pemesanan')->where('id_pemesanan', (int)$job['id_pemesanan'])->update([
            'status_pemesanan' => Status::ORDER_REVISI_DIPROSES,
        ]);

        return redirect()->to(site_url('editor/tugas/'.$idJadwal))->with('success', 'Revisi diterima. Status produksi berubah ke REVISI.');
    }

    public function rejectRevisi($idJadwal)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idEditor = (int) session()->get('id_user');

        $job = $db->table('jadwal_produksi j')
            ->select('j.id_jadwal,j.id_editor,j.id_pemesanan,j.status_produksi, pm.status_pemesanan')
            ->join('pemesanan pm', 'pm.id_pemesanan = j.id_pemesanan', 'left')
            ->where('j.id_jadwal', (int)$idJadwal)
            ->get()->getRowArray();

        if (!$job || (int)$job['id_editor'] !== $idEditor) {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        $statusPesanan = strtolower((string)($job['status_pemesanan'] ?? ''));
        if ($statusPesanan !== Status::ORDER_REVISI_PELANGGAN) {
            return redirect()->back()->with('error', 'Tidak ada request revisi yang pending.');
        }

        $now = date('Y-m-d H:i:s');

        $old = $db->table('jadwal_produksi')->select('catatan_produksi')->where('id_jadwal', (int)$idJadwal)->get()->getRowArray();
        $oldLog = trim((string)($old['catatan_produksi'] ?? ''));
        $line = "[{$now}] EDITOR: reject revisi";
        $newLog = trim($oldLog . "\n" . $line);

        $db->table('jadwal_produksi')->where('id_jadwal', (int)$idJadwal)->update([
            'catatan_produksi' => $newLog,
        ]);

        $restore = $this->restoreOrderStatusAfterRevisi($db, (int)$job['id_pemesanan']);

        $db->table('pemesanan')->where('id_pemesanan', (int)$job['id_pemesanan'])->update([
            'status_pemesanan' => $restore,
        ]);

        return redirect()->to(site_url('editor/tugas/'.$idJadwal))->with('success', 'Revisi ditolak. Status pemesanan dikembalikan.');
    }

    public function update($idJadwal)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idEditor = (int) session()->get('id_user');

        $job = $db->table('jadwal_produksi')
            ->where('id_jadwal', (int)$idJadwal)
            ->get()->getRowArray();

        if (!$job || (int)$job['id_editor'] !== $idEditor) {
            return redirect()->to(site_url('editor/tugas'))->with('error', 'Tugas tidak ditemukan / bukan milik kamu.');
        }

        $statusNow = strtolower((string)($job['status_produksi'] ?? ''));
        if (!$this->isEditingStatus($statusNow)) {
            return redirect()->back()->with('error', 'Belum masuk tahap editing. Admin harus ubah status produksi ke "cut_to_cut" dulu.');
        }

        $tahap   = strtolower(trim((string) $this->request->getPost('tahap')));
        $catatan = trim((string) $this->request->getPost('catatan'));
        $url     = trim((string) $this->request->getPost('url_preview'));
        $linkHasil = trim((string) $this->request->getPost('link_hasil'));

        $allowed = $this->allowedNext($statusNow);
        if (!in_array($tahap, $allowed, true)) {
            return redirect()->back()->withInput()->with('error', 'Transisi status tidak valid.');
        }

        // Validasi link_hasil kalau diisi
        if ($linkHasil !== '' && ! \App\Libraries\ResultNotifier::isValidDriveLink($linkHasil)) {
            return redirect()->back()->withInput()->with('error', 'Link hasil harus URL Google Drive / Google Docs yang valid.');
        }

        // Upload file preview (JPG/PNG/PDF max 10MB)
        $savedFile = null;
        $file = $this->request->getFile('file_preview');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $ext = strtolower($file->getClientExtension());
            $sizeKb = (int)$file->getSizeByUnit('kb');

            if (!in_array($ext, ['jpg','jpeg','png','pdf'], true)) {
                return redirect()->back()->withInput()->with('error', 'File preview harus JPG/PNG/PDF.');
            }
            if ($sizeKb > 10240) {
                return redirect()->back()->withInput()->with('error', 'File preview maksimal 10MB.');
            }

            $dir = WRITEPATH . 'uploads/progres/' . (int)$idJadwal;
            if (!is_dir($dir)) @mkdir($dir, 0775, true);

            $savedFile = 'preview_' . $tahap . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
            $file->move($dir, $savedFile);
        }

        $now = date('Y-m-d H:i:s');
        $logLine = "[{$now}] EDITOR: {$tahap}";
        if ($catatan !== '') $logLine .= " | catatan: {$catatan}";
        if ($url !== '')     $logLine .= " | url: {$url}";
        if ($savedFile)      $logLine .= " | file: {$savedFile}";

        $oldCat = (string)($job['catatan_produksi'] ?? '');
        $newCat = trim($oldCat . "\n" . $logLine);

        $update = [
            'status_produksi'  => $tahap,
            'catatan_produksi' => $newCat,
        ];

        // link_hasil
        if ($linkHasil !== '') {
            $update['link_hasil'] = $linkHasil;
        }

        $db->table('jadwal_produksi')->where('id_jadwal', (int)$idJadwal)->update($update);

        // Trigger email "hasil siap" idempotent kalau link ada
        if ($linkHasil !== '' || ! empty($job['link_hasil'])) {
            $reloaded = $db->table('jadwal_produksi')->where('id_jadwal', (int)$idJadwal)->get()->getRowArray();
            $order    = $db->table('pemesanan p')
                ->select('p.*, u.email, u.nama_lengkap, pk.nama_paket')
                ->join('user u', 'u.id_user = p.id_user', 'left')
                ->join('paket pk', 'pk.id_paket = p.id_paket', 'left')
                ->where('p.id_pemesanan', (int)$reloaded['id_pemesanan'])
                ->get()->getRowArray();
            $paket = ['nama_paket' => $order['nama_paket'] ?? ''];
            $user  = ['email' => $order['email'] ?? '', 'nama_lengkap' => $order['nama_lengkap'] ?? ''];

            $notifier = new ResultNotifier(new Mailer());
            $notifier->notifyIfNeeded($reloaded, $order, $user, $paket);
        }

        // Logika revisi selesai -> cek batas 2x
        if ($statusNow === Status::PROD_REVISI && $tahap === Status::PROD_REVISI_SELESAI) {
            $ord2 = $db->table('pemesanan')
                ->select('catatan_pelanggan,status_pemesanan')
                ->where('id_pemesanan', (int)$job['id_pemesanan'])
                ->get()->getRowArray();

            $revCount = $this->countRevisi((string)($ord2['catatan_pelanggan'] ?? ''));
            if ($revCount >= 2) {
                $db->table('pemesanan')->where('id_pemesanan', (int)$job['id_pemesanan'])->update([
                    'status_pemesanan' => Status::ORDER_SERAH_TERIMA_HASIL,
                ]);
            } else {
                $restore = $this->restoreOrderStatusAfterRevisi($db, (int)$job['id_pemesanan']);
                $db->table('pemesanan')->where('id_pemesanan', (int)$job['id_pemesanan'])->update([
                    'status_pemesanan' => $restore,
                ]);
            }
        }

        return redirect()->to(site_url('editor/tugas/'.$idJadwal))->with('success', 'Progres berhasil diupdate.');
    }

    public function file($idJadwal, $filename)
    {
        if ($resp = $this->guard()) return $resp;

        $db = db_connect();
        $idEditor = (int) session()->get('id_user');

        $job = $db->table('jadwal_produksi')
            ->select('id_jadwal,id_editor')
            ->where('id_jadwal', (int)$idJadwal)
            ->get()->getRowArray();

        if (!$job || (int)$job['id_editor'] !== $idEditor) {
            return redirect()->back()->with('error', 'Akses ditolak.');
        }

        $safe = basename((string)$filename);
        $path = WRITEPATH . 'uploads/progres/' . (int)$idJadwal . '/' . $safe;

        if (!is_file($path)) {
            return redirect()->back()->with('error', 'File tidak ditemukan.');
        }

        $mime = @mime_content_type($path) ?: 'application/octet-stream';
        return $this->response
            ->setContentType($mime)
            ->setHeader('Content-Disposition', 'inline; filename="'.$safe.'"')
            ->setBody(file_get_contents($path));
    }
}
