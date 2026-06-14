<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Tabel detail_pemesanan — sebelumnya direferensikan oleh model
 * DetailPemesananModel dan DatabaseSeeder tapi tidak punya migration.
 * Sekarang dibuat resmi. Idempotent.
 */
class CreateDetailPemesananTable extends Migration
{
    public function up()
    {
        if ($this->db->tableExists('detail_pemesanan')) {
            return;
        }

        $this->forge->addField([
            'id_detail' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'id_pemesanan' => [
                'type'       => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
            ],
            'nama_item' => [
                'type'       => 'VARCHAR',
                'constraint' => 100,
            ],
            'qty' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 1,
            ],
            'harga_satuan' => [
                'type'       => 'BIGINT',
                'constraint' => 20,
                'unsigned'   => true,
                'default'    => 0,
            ],
            'subtotal' => [
                'type'       => 'BIGINT',
                'constraint' => 20,
                'unsigned'   => true,
                'default'    => 0,
            ],
        ]);

        $this->forge->addKey('id_detail', true);
        $this->forge->addKey('id_pemesanan');
        $this->forge->addForeignKey('id_pemesanan', 'pemesanan', 'id_pemesanan', 'CASCADE', 'CASCADE');

        $this->forge->createTable('detail_pemesanan', true, [
            'ENGINE'  => 'InnoDB',
            'DEFAULT CHARSET' => 'utf8mb4',
            'COLLATE' => 'utf8mb4_unicode_ci',
        ]);
    }

    public function down()
    {
        if ($this->db->tableExists('detail_pemesanan')) {
            $this->forge->dropTable('detail_pemesanan', true);
        }
    }
}
