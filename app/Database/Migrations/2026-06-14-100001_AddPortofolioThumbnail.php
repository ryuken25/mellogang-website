<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Tambah kolom portofolio.thumbnail (dipakai model).
 * Kolom referensi_url_media sudah ada; thumbnail adalah tambahan.
 * Idempotent.
 */
class AddPortofolioThumbnail extends Migration
{
    public function up()
    {
        if (! $this->db->tableExists('portofolio')) {
            return;
        }
        if (! $this->db->fieldExists('thumbnail', 'portofolio')) {
            $this->forge->addColumn('portofolio', [
                'thumbnail' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 255,
                    'null'       => true,
                    'after'      => 'url_media',
                ],
            ]);
        }
    }

    public function down()
    {
        if ($this->db->tableExists('portofolio') && $this->db->fieldExists('thumbnail', 'portofolio')) {
            $this->forge->dropColumn('portofolio', 'thumbnail');
        }
    }
}
