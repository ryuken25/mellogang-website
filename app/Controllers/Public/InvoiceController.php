<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use CodeIgniter\Exceptions\PageNotFoundException;

class InvoiceController extends BaseController
{
    private function normStatus($s): string
    {
        return strtolower(trim((string) $s));
    }

    public function show($kode)
    {
        $db = db_connect();

        $kode = trim((string) $kode);

        $loggedIn = (bool) session()->get('logged_in');
        $role     = (string) session()->get('role');
        $idUser   = (int) (session()->get('id_user') ?? 0);

        $order = $db->table('pemesanan p')
            ->select('p.*, u.nama_lengkap, u.email, u.no_telepon, pk.nama_paket, pk.kategori, pk.harga AS harga_paket')
            ->join('user u', 'u.id_user = p.id_user', 'left')
            ->join('paket pk', 'pk.id_paket = p.id_paket', 'left')
            ->where('p.kode_pemesanan', $kode)
            ->get()->getRowArray();

        if (!$order) {
            throw PageNotFoundException::forPageNotFound("Invoice tidak ditemukan.");
        }

        $isAdmin = $loggedIn && $role === 'admin';
        $isOwner = $loggedIn && $role === 'pelanggan' && ((int) $order['id_user'] === $idUser);

        if (!$isAdmin && !$isOwner) {
            return redirect()->to(site_url('login'))->with('error', 'Login dulu ya untuk melihat invoice.');
        }

        $payRows = $db->table('pembayaran')
            ->where('id_pemesanan', (int) $order['id_pemesanan'])
            ->orderBy('id_pembayaran', 'ASC')
            ->get()->getResultArray();

        $validPays  = [];
        $totalValid = 0;

        foreach ($payRows as $p) {
            if ($this->normStatus($p['status_verifikasi'] ?? '') !== 'valid') {
                continue;
            }
            $validPays[] = $p;
            $totalValid += (int) ($p['jumlah_bayar'] ?? 0);
        }

        if ($totalValid <= 0) {
            return redirect()
                ->to(site_url('status-pesanan?kode=' . urlencode($kode)))
                ->with('error', 'Invoice baru tersedia setelah pembayaran divalidasi admin.');
        }

        // Total tagihan: prioritas total_biaya, fallback harga paket
        $totalTagihan = 0;
        if (isset($order['total_biaya']) && is_numeric($order['total_biaya'])) {
            $totalTagihan = (int) $order['total_biaya'];
        } elseif (isset($order['harga_paket']) && is_numeric($order['harga_paket'])) {
            $totalTagihan = (int) $order['harga_paket'];
        } elseif (isset($order['total_harga']) && is_numeric($order['total_harga'])) {
            $totalTagihan = (int) $order['total_harga'];
        }

        $sisaBayar = max(0, $totalTagihan - $totalValid);

        $download = (int) ($this->request->getGet('download') ?? 0) === 1;
        $invoiceNo = 'INV-' . $kode;

        $data = [
            'title'        => 'Invoice ' . $kode,
            'order'        => $order,
            'validPays'    => $validPays,
            'totalValid'   => $totalValid,
            'totalTagihan' => $totalTagihan,
            'sisaBayar'    => $sisaBayar,
            'invoiceNo'    => $invoiceNo,
            'issuedAt'     => date('Y-m-d H:i:s'),
        ];

        // ?download=1 must return a real PDF (Dompdf), not HTML attachment.
        if ($download) {
            try {
                $pdf = (new \App\Libraries\InvoicePdf())->render(
                    $order,
                    $validPays,
                    $totalTagihan,
                    $totalValid,
                    $sisaBayar,
                    $invoiceNo
                );

                $filename = 'invoice-' . preg_replace('/[^A-Za-z0-9._-]+/', '-', $kode) . '.pdf';

                return $this->response
                    ->setHeader('Content-Type', 'application/pdf')
                    ->setHeader('Content-Disposition', 'attachment; filename="' . $filename . '"')
                    ->setHeader('Cache-Control', 'private, max-age=0, must-revalidate')
                    ->setHeader('Pragma', 'public')
                    ->setBody($pdf);
            } catch (\Throwable $e) {
                log_message('error', 'Invoice PDF download failed for {kode}: {err}', [
                    'kode' => $kode,
                    'err'  => $e->getMessage(),
                ]);

                return redirect()
                    ->to(site_url('invoice/' . urlencode($kode)))
                    ->with('error', 'Gagal generate PDF invoice. Coba Print / Save PDF dulu.');
            }
        }

        return view('public/invoice/index', $data);
    }
}
