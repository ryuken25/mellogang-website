<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Midtrans Snap support.
 *
 * - pembayaran: kolom gateway (manual|midtrans) + metadata transaksi Midtrans.
 *   Catatan: gateway pakai VARCHAR, bukan ENUM — portable MySQL/Postgres
 *   (CI4 Forge tidak punya ENUM di Postgre).
 * - payment_notification: audit log semua payload webhook + alat bantu
 *   idempotency.
 *
 * Idempotent: fieldExists/tableExists guard, konsisten dengan migrasi lain.
 */
class AddMidtransPaymentSupport extends Migration
{
    public function up()
    {
        if ($this->db->tableExists('pembayaran')) {
            $add = [];

            if (! $this->db->fieldExists('gateway', 'pembayaran')) {
                $add['gateway'] = [
                    'type'       => 'VARCHAR',
                    'constraint' => 16,
                    'default'    => 'manual',
                ];
            }
            if (! $this->db->fieldExists('midtrans_order_id', 'pembayaran')) {
                $add['midtrans_order_id'] = [
                    'type'       => 'VARCHAR',
                    'constraint' => 64,
                    'null'       => true,
                ];
            }
            if (! $this->db->fieldExists('snap_token', 'pembayaran')) {
                $add['snap_token'] = [
                    'type'       => 'VARCHAR',
                    'constraint' => 255,
                    'null'       => true,
                ];
            }
            if (! $this->db->fieldExists('payment_type', 'pembayaran')) {
                $add['payment_type'] = [
                    'type'       => 'VARCHAR',
                    'constraint' => 50,
                    'null'       => true,
                ];
            }
            if (! $this->db->fieldExists('transaction_status', 'pembayaran')) {
                $add['transaction_status'] = [
                    'type'       => 'VARCHAR',
                    'constraint' => 30,
                    'null'       => true,
                ];
            }
            if (! $this->db->fieldExists('gross_amount', 'pembayaran')) {
                $add['gross_amount'] = [
                    'type' => 'BIGINT',
                    'null' => true,
                ];
            }
            if (! $this->db->fieldExists('paid_at', 'pembayaran')) {
                $add['paid_at'] = [
                    'type' => 'DATETIME',
                    'null' => true,
                ];
            }

            if ($add !== []) {
                $this->forge->addColumn('pembayaran', $add);
            }

            // UNIQUE index untuk midtrans_order_id (nullable — NULL boleh banyak).
            $isPostgre = $this->db->DBDriver === 'Postgre';
            if ($isPostgre) {
                $this->db->query('CREATE UNIQUE INDEX IF NOT EXISTS pembayaran_midtrans_order_id ON '
                    . $this->db->escapeIdentifiers('pembayaran')
                    . ' (' . $this->db->escapeIdentifiers('midtrans_order_id') . ')');
            } else {
                $exists = $this->db->query(
                    'SELECT COUNT(*) AS c FROM information_schema.statistics
                     WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?',
                    ['pembayaran', 'pembayaran_midtrans_order_id']
                )->getRowArray();
                if ((int) ($exists['c'] ?? 0) === 0) {
                    $this->db->query('CREATE UNIQUE INDEX ' . $this->db->escapeIdentifiers('pembayaran_midtrans_order_id')
                        . ' ON ' . $this->db->escapeIdentifiers('pembayaran')
                        . ' (' . $this->db->escapeIdentifiers('midtrans_order_id') . ')');
                }
            }
        }

        if (! $this->db->tableExists('payment_notification')) {
            $this->forge->addField([
                'id' => [
                    'type'           => 'BIGINT',
                    'unsigned'       => true,
                    'auto_increment' => true,
                ],
                'midtrans_order_id' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 64,
                ],
                'transaction_status' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 30,
                    'null'       => true,
                ],
                'status_code' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 10,
                    'null'       => true,
                ],
                'signature_valid' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 0,
                ],
                'raw_payload' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('midtrans_order_id');
            $this->forge->createTable('payment_notification', true);
        }
    }

    public function down()
    {
        // forward-only (konsisten dengan migrasi v2 lain)
    }
}
