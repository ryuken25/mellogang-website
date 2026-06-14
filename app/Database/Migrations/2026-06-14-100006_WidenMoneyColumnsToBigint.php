<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Widening INT → BIGINT UNSIGNED untuk kolom uang.
 * Aman: widening tidak menghilangkan data.
 *
 * Kolom: paket.harga, pemesanan.total_biaya,
 * pembayaran.jumlah_bayar, pengeluaran_operasional.nominal.
 *
 * Untuk MySQL, MODIFY COLUMN cukup.
 */
class WidenMoneyColumnsToBigint extends Migration
{
    public function up()
    {
        $widens = [
            ['paket', 'harga', 'BIGINT(20) UNSIGNED NOT NULL DEFAULT 0'],
            ['pemesanan', 'total_biaya', 'BIGINT(20) UNSIGNED NOT NULL DEFAULT 0'],
            ['pembayaran', 'jumlah_bayar', 'BIGINT(20) UNSIGNED NOT NULL DEFAULT 0'],
            ['pengeluaran_operasional', 'nominal', 'BIGINT(20) UNSIGNED NOT NULL DEFAULT 0'],
        ];

        foreach ($widens as [$table, $col, $def]) {
            if (! $this->db->tableExists($table)) {
                continue;
            }
            if (! $this->db->fieldExists($col, $table)) {
                continue;
            }
            // Tabel paket.harga NOT NULL DEFAULT 1 sebelumnya (lihat CreatePaketTable).
            // Kita pakai DEFAULT 0 untuk konsistensi.
            $sql = "ALTER TABLE `{$table}` MODIFY COLUMN `{$col}` {$def}";
            $this->db->query($sql);
        }
    }

    public function down()
    {
        // forward-only
    }
}
