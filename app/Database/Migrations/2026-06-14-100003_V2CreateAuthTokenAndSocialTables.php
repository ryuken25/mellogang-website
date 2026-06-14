<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Buat tabel auth_token untuk verifikasi email / unlock / reset sandi.
 * Tabel social_post (cache fetch) dan social_fetch_job (lifecycle).
 * Idempotent.
 */
class V2CreateAuthTokenAndSocialTables extends Migration
{
    public function up()
    {
        // ===== auth_token =====
        if (! $this->db->tableExists('auth_token')) {
            $this->forge->addField([
                'id' => [
                    'type'           => 'INT',
                    'constraint'     => 11,
                    'unsigned'       => true,
                    'auto_increment' => true,
                ],
                'id_user' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'unsigned'   => true,
                ],
                'type' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 20,
                ],
                'token_hash' => [
                    'type'       => 'CHAR',
                    'constraint' => 64,
                ],
                'otp_code' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 6,
                    'null'       => true,
                ],
                'expires_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'used_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey(['id_user', 'type']);
            $this->forge->addKey('token_hash');
            $this->forge->addForeignKey('id_user', 'user', 'id_user', 'CASCADE', 'CASCADE');
            $this->forge->createTable('auth_token', true, [
                'ENGINE' => 'InnoDB',
                'DEFAULT CHARSET' => 'utf8mb4',
                'COLLATE' => 'utf8mb4_unicode_ci',
            ]);
        }

        // ===== social_post (cache) =====
        if (! $this->db->tableExists('social_post')) {
            $this->forge->addField([
                'id' => [
                    'type'           => 'INT',
                    'constraint'     => 11,
                    'unsigned'       => true,
                    'auto_increment' => true,
                ],
                'platform' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 16,
                ],
                'external_id' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 64,
                ],
                'type' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 20,
                    'null'       => true,
                ],
                'title' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 255,
                    'null'       => true,
                ],
                'caption' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'media_url' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 512,
                    'null'       => true,
                ],
                'thumbnail_url' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 512,
                    'null'       => true,
                ],
                'permalink' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 512,
                    'null'       => true,
                ],
                'posted_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'fetched_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'is_featured' => [
                    'type'       => 'TINYINT',
                    'constraint' => 1,
                    'default'    => 0,
                ],
                'raw' => [
                    'type' => 'JSON',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            // UNIQUE composite (platform, external_id)
            $this->forge->addUniqueKey(['platform', 'external_id']);
            $this->forge->addKey(['platform', 'posted_at']);
            $this->forge->createTable('social_post', true, [
                'ENGINE' => 'InnoDB',
                'DEFAULT CHARSET' => 'utf8mb4',
                'COLLATE' => 'utf8mb4_unicode_ci',
            ]);
        }

        // ===== social_fetch_job =====
        if (! $this->db->tableExists('social_fetch_job')) {
            $this->forge->addField([
                'id' => [
                    'type'           => 'INT',
                    'constraint'     => 11,
                    'unsigned'       => true,
                    'auto_increment' => true,
                ],
                'status' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 12,
                    'default'    => 'queued',
                ],
                'platforms' => [
                    'type'       => 'VARCHAR',
                    'constraint' => 40,
                    'null'       => true,
                ],
                'started_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'finished_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
                'items_youtube' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'default'    => 0,
                ],
                'items_instagram' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'default'    => 0,
                ],
                'message' => [
                    'type' => 'TEXT',
                    'null' => true,
                ],
                'triggered_by' => [
                    'type'       => 'INT',
                    'constraint' => 11,
                    'unsigned'   => true,
                    'null'       => true,
                ],
                'created_at' => [
                    'type' => 'DATETIME',
                    'null' => true,
                ],
            ]);
            $this->forge->addKey('id', true);
            $this->forge->addKey('status');
            $this->forge->addKey('created_at');
            $this->forge->createTable('social_fetch_job', true, [
                'ENGINE' => 'InnoDB',
                'DEFAULT CHARSET' => 'utf8mb4',
                'COLLATE' => 'utf8mb4_unicode_ci',
            ]);
        }
    }

    public function down()
    {
        // forward-only
    }
}
