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
            ['paket', 'harga'],
            ['pemesanan', 'total_biaya'],
            ['pembayaran', 'jumlah_bayar'],
            ['pengeluaran_operasional', 'nominal'],
        ];

        $isPostgre = $this->db->DBDriver === 'Postgre';

        foreach ($widens as [$table, $col]) {
            if (! $this->db->tableExists($table)) {
                continue;
            }
            if (! $this->db->fieldExists($col, $table)) {
                continue;
            }

            $qTable = $this->db->escapeIdentifiers($table);
            $qCol   = $this->db->escapeIdentifiers($col);

            // Tabel paket.harga NOT NULL DEFAULT 1 sebelumnya (lihat CreatePaketTable).
            // Kita pakai DEFAULT 0 untuk konsistensi.
            if ($isPostgre) {
                // Postgres tidak punya UNSIGNED; BIGINT + NOT NULL + DEFAULT 0.
                $this->db->query("ALTER TABLE {$qTable} ALTER COLUMN {$qCol} TYPE BIGINT");
                $this->db->query("ALTER TABLE {$qTable} ALTER COLUMN {$qCol} SET DEFAULT 0");
                $this->db->query("ALTER TABLE {$qTable} ALTER COLUMN {$qCol} SET NOT NULL");
            } else {
                $this->db->query("ALTER TABLE {$qTable} MODIFY COLUMN {$qCol} BIGINT(20) UNSIGNED NOT NULL DEFAULT 0");
            }
        }
    }

    public function down()
    {
        // forward-only
    }
}
