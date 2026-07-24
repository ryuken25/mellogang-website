<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Buat UNIQUE INDEX untuk email_canonical (kalau belum ada) dan
 * google_id (kalau belum ada).
 *
 * Tambahan: index untuk kolom yang sering difilter agar query tidak
 * pakai LOWER() lagi.
 *
 * Idempotent lintas driver: MySQL cek information_schema.statistics,
 * Postgres pakai CREATE INDEX IF NOT EXISTS.
 */
class V2AddCanonicalAndHelperIndexes extends Migration
{
    public function up()
    {
        if (! $this->db->tableExists('user')) {
            return;
        }

        $this->ensureUniqueIndex('user', 'email_canonical', 'email_canonical');
        $this->ensureUniqueIndex('user', 'google_id', 'google_id');
        $this->ensureIndex('user', 'auth_provider');

        // Pemesanan
        if ($this->db->tableExists('pemesanan')) {
            $this->ensureIndex('pemesanan', 'status_pemesanan');
            $this->ensureIndex('pemesanan', 'tanggal_acara');
            // id_user & id_paket sudah ada
        }

        // Pembayaran
        if ($this->db->tableExists('pembayaran')) {
            $this->ensureIndex('pembayaran', 'status_verifikasi');
            $this->ensureIndex('pembayaran', ['id_pemesanan', 'status_verifikasi'], 'pembayaran_idpem_statusverif');
        }

        // Jadwal produksi
        if ($this->db->tableExists('jadwal_produksi')) {
            $this->ensureIndex('jadwal_produksi', 'status_produksi');
            $this->ensureIndex('jadwal_produksi', ['id_editor', 'status_produksi'], 'jadwal_ideditor_statusprod');
        }

        // Paket
        if ($this->db->tableExists('paket')) {
            $this->ensureIndex('paket', 'is_active');
        }
    }

    /**
     * Cek + buat UNIQUE index, idempotent lintas driver.
     * MySQL: cek information_schema.statistics. Postgres: IF NOT EXISTS.
     */
    private function ensureUniqueIndex(string $table, string $column, string $indexName): void
    {
        $this->createIndex($table, [$column], $indexName, true);
    }

    private function ensureIndex(string $table, string|array $column, ?string $indexName = null): void
    {
        $cols = is_array($column) ? $column : [$column];
        $name = $indexName ?? $table . '_' . implode('_', $cols) . '_idx';
        $this->createIndex($table, $cols, $name, false);
    }

    private function createIndex(string $table, array $cols, string $name, bool $unique): void
    {
        $isPostgre = $this->db->DBDriver === 'Postgre';

        if (! $isPostgre && $this->indexExists($table, $name)) {
            return;
        }

        $unq     = $unique ? 'UNIQUE ' : '';
        $ifne    = $isPostgre ? 'IF NOT EXISTS ' : '';
        $qName   = $this->db->escapeIdentifiers($name);
        $qTable  = $this->db->escapeIdentifiers($table);
        $colList = implode(',', array_map(fn ($c) => $this->db->escapeIdentifiers($c), $cols));

        $this->db->query("CREATE {$unq}INDEX {$ifne}{$qName} ON {$qTable} ({$colList})");
    }

    /**
     * Hanya dipakai di MySQL (Postgres pakai IF NOT EXISTS).
     */
    private function indexExists(string $table, string $indexName): bool
    {
        $row = $this->db->query(
            "SELECT COUNT(*) AS c FROM information_schema.statistics
             WHERE table_schema = DATABASE()
               AND table_name = ?
               AND index_name = ?",
            [$table, $indexName]
        )->getRowArray();
        return ((int)($row['c'] ?? 0)) > 0;
    }

    public function down()
    {
        // forward-only
    }
}
