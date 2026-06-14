<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreatePemesananTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id_pemesanan' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'kode_pemesanan' => [
                'type'       => 'VARCHAR',
                'constraint' => 20,
            ],
            'id_user' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'id_paket' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'tanggal_pemesanan' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'tanggal_acara' => [
                'type' => 'DATE',
                'null' => true,
            ],
            'jam_mulai_acara' => [ // ✅ tambahan sesuai tabel 4.6
                'type' => 'TIME',
                'null' => true,
            ],
            'lokasi_acara' => [
                'type'       => 'VARCHAR',
                'constraint' => 150,
            ],
            'status_pemesanan' => [
                'type'       => 'VARCHAR',
                'constraint' => 30,
                'default'    => 'Menunggu pembayaran',
            ],
            'total_biaya' => [
                'type'       => 'INT',
                'constraint' => 11,
                'default'    => 0,
            ],
            'catatan_pelanggan' => [
                'type' => 'TEXT',
                'null' => true,
            ],
            'catatan_admin' => [
                'type' => 'TEXT',
                'null' => true,
            ],
        ]);

        $this->forge->addKey('id_pemesanan', true);
        $this->forge->addUniqueKey('kode_pemesanan');
        $this->forge->addKey('id_user');
        $this->forge->addKey('id_paket');

        // ✅ Foreign Key ke user & paket
        $this->forge->addForeignKey('id_user', 'user', 'id_user', 'RESTRICT', 'CASCADE');
        $this->forge->addForeignKey('id_paket', 'paket', 'id_paket', 'RESTRICT', 'CASCADE');

        $this->forge->createTable('pemesanan', true, [
            'ENGINE'         => 'InnoDB',
            'DEFAULT CHARSET'=> 'utf8mb4',
            'COLLATE'        => 'utf8mb4_unicode_ci',
        ]);
    }

    public function down()
    {
        $this->forge->dropTable('pemesanan', true);
    }
}
