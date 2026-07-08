<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Support\Status;
use CodeIgniter\HTTP\ResponseInterface;

class DashboardApiController extends BaseController
{
    private function json(array $payload, int $status = 200): ResponseInterface
    {
        $origin = (string) $this->request->getHeaderLine('Origin');
        return $this->response
            ->setStatusCode($status)
            ->setHeader('Access-Control-Allow-Origin', $origin !== '' ? $origin : '*')
            ->setHeader('Access-Control-Allow-Credentials', 'true')
            ->setHeader('Vary', 'Origin')
            ->setJSON($payload);
    }

    public function adminSummary(): ResponseInterface
    {
        $db = db_connect();

        $totalOrders = (int) $db->table('pemesanan')->countAllResults();
        $pendingPayments = (int) $db->table('pembayaran')
            ->where('status_verifikasi', Status::VERIF_MENUNGGU)
            ->countAllResults();
        $activeSchedules = (int) $db->table('jadwal_produksi')
            ->whereNotIn('status_produksi', ['done', 'revisi_selesai', 'revisi selesai'])
            ->countAllResults();
        $completedProjects = (int) $db->table('jadwal_produksi')
            ->groupStart()
                ->where('status_produksi', 'done')
                ->orWhere('status_produksi', 'revisi_selesai')
                ->orWhere('status_produksi', 'revisi selesai')
            ->groupEnd()
            ->countAllResults();

        $recentOrders = $db->table('pemesanan p')
            ->select('p.kode_pemesanan, p.status_pemesanan, p.tanggal_acara, p.total_biaya, u.nama_lengkap, pk.nama_paket')
            ->join('user u', 'u.id_user = p.id_user', 'left')
            ->join('paket pk', 'pk.id_paket = p.id_paket', 'left')
            ->orderBy('p.id_pemesanan', 'DESC')
            ->limit(8)
            ->get()->getResultArray();

        return $this->json([
            'data' => [
                'totalOrders' => $totalOrders,
                'pendingPayments' => $pendingPayments,
                'activeSchedules' => $activeSchedules,
                'completedProjects' => $completedProjects,
                'recentOrders' => $recentOrders,
            ],
        ]);
    }
}
