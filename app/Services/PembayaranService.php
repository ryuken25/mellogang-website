<?php

namespace App\Services;

use App\Support\Status;

/**
 * Domain logic pembayaran yang dipakai bersama oleh verifikasi admin
 * (Admin\PembayaranController::verify) dan webhook Midtrans.
 *
 * Sebelumnya logika ini inline di controller admin dan MASIH memakai status
 * ber-spasi ("menunggu pembayaran") — dead code sejak normalisasi snake_case.
 */
class PembayaranService
{
    /**
     * Hitung ulang status_pemesanan dari rekap pembayaran.
     * Hanya menyentuh pesanan yang masih di fase pembayaran (tidak mengganggu
     * status produksi / serah terima / batal).
     */
    public function recalcOrderStatus(int $idPemesanan): ?string
    {
        $db    = db_connect();
        $order = $db->table('pemesanan')->where('id_pemesanan', $idPemesanan)->get()->getRowArray();

        if (! $order) {
            return null;
        }

        $currentStatus = strtolower(trim((string) ($order['status_pemesanan'] ?? '')));
        $allowed       = [
            Status::ORDER_MENUNGGU_PEMBAYARAN,
            Status::ORDER_MENUNGGU_PELUNASAN,
            Status::ORDER_MENUNGGU_VERIFIKASI,
            Status::ORDER_LUNAS,
        ];

        if (! in_array($currentStatus, $allowed, true)) {
            return null; // status di luar fase pembayaran — jangan diubah
        }

        $totalOrder = (int) ($order['total_biaya'] ?? 0);

        $payRows = $db->table('pembayaran')
            ->select('jenis_pembayaran, jumlah_bayar, status_verifikasi')
            ->where('id_pemesanan', $idPemesanan)
            ->get()->getResultArray();

        $sumValid   = 0;
        $hasWaiting = false;

        foreach ($payRows as $r) {
            $st = strtolower(trim((string) ($r['status_verifikasi'] ?? '')));
            if ($st === Status::VERIF_MENUNGGU) {
                $hasWaiting = true;
            }
            if ($st !== Status::VERIF_VALID) {
                continue;
            }
            $sumValid += (int) ($r['jumlah_bayar'] ?? 0);
        }

        $newStatus = Status::ORDER_MENUNGGU_PEMBAYARAN;
        if ($totalOrder > 0 && $sumValid >= $totalOrder) {
            $newStatus = Status::ORDER_LUNAS;
        } elseif ($hasWaiting) {
            $newStatus = Status::ORDER_MENUNGGU_VERIFIKASI;
        } elseif ($sumValid > 0) {
            $newStatus = Status::ORDER_MENUNGGU_PELUNASAN;
        }

        if ($newStatus !== $currentStatus) {
            $db->table('pemesanan')->where('id_pemesanan', $idPemesanan)->update([
                'status_pemesanan' => $newStatus,
            ]);
        }

        return $newStatus;
    }
}
