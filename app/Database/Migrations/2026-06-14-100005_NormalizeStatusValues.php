<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Normalisasi nilai status yang sudah ada di DB ke bentuk kanonik
 * (lowercase + snake_case). Lihat DECISIONS.md §4.
 *
 * Idempotent: hanya UPDATE kalau nilai lama belum kanonik.
 */
class NormalizeStatusValues extends Migration
{
    public function up()
    {
        // ===== pemesanan.status_pemesanan =====
        if ($this->db->tableExists('pemesanan') && $this->db->fieldExists('status_pemesanan', 'pemesanan')) {
            $this->normalize(
                'pemesanan',
                'status_pemesanan',
                [
                    'menunggu pembayaran'          => 'menunggu_pembayaran',
                    'menunggu pelunasan'           => 'menunggu_pelunasan',
                    'menunggu verifikasi'          => 'menunggu_verifikasi',
                    'lunas'                        => 'lunas',
                    'revisi pelanggan'             => 'revisi_pelanggan',
                    'revisi diproses'              => 'revisi_diproses',
                    'serah terima hasil'           => 'serah_terima_hasil',
                    'selesai'                      => 'selesai',
                    'batal'                        => 'batal',
                    'ditolak'                      => 'ditolak',
                ]
            );
        }

        // ===== jadwal_produksi.status_produksi =====
        if ($this->db->tableExists('jadwal_produksi') && $this->db->fieldExists('status_produksi', 'jadwal_produksi')) {
            $this->normalize(
                'jadwal_produksi',
                'status_produksi',
                [
                    'pra produksi'   => 'pra_produksi',
                    'shooting'       => 'shooting',
                    'cut-to-cut'     => 'cut_to_cut',
                    'cut to cut'     => 'cut_to_cut',
                    'finishing'      => 'finishing',
                    'done'           => 'done',
                    'revisi'         => 'revisi',
                    'revisi selesai' => 'revisi_selesai',
                ]
            );
        }

        // ===== pembayaran.status_verifikasi =====
        if ($this->db->tableExists('pembayaran') && $this->db->fieldExists('status_verifikasi', 'pembayaran')) {
            $this->normalize(
                'pembayaran',
                'status_verifikasi',
                [
                    'menunggu' => 'menunggu',
                    'valid'    => 'valid',
                    'ditolak'  => 'ditolak',
                ]
            );
        }
    }

    /**
     * Untuk setiap (oldValue => newValue), jalankan UPDATE kalau
     * ada baris dengan nilai lama. LOWER+TRIM supaya pencocokan
     * case-insensitive.
     */
    private function normalize(string $table, string $col, array $map): void
    {
        foreach ($map as $old => $new) {
            $oldLower = strtolower($old);
            $newLower = strtolower($new);
            if ($oldLower === $newLower) {
                continue; // tidak perlu diubah
            }
            $qTable = $this->db->escapeIdentifiers($table);
            $qCol   = $this->db->escapeIdentifiers($col);
            $this->db->query(
                "UPDATE {$qTable} SET {$qCol} = ? WHERE LOWER(TRIM({$qCol})) = ?",
                [$new, $oldLower]
            );
        }
    }

    public function down()
    {
        // forward-only
    }
}
