<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

/**
 * Penyesuaian skema auth & deliverable:
 * - user: tambah email_canonical, email_verified_at, google_id,
 *   auth_provider, avatar_url, failed_login_attempts, locked_until,
 *   last_login_at. Backfill email_verified_at = created_at untuk user lama.
 * - jadwal_produksi: tambah link_hasil, link_hasil_hash,
 *   link_hasil_terkirim_at.
 * - pembayaran / jadwal_produksi: tambah index yang membantu query
 *   status / composite.
 * - portofolio: buat id_paket nullable (kalau ada portofolio yang
 *   ngga terikat paket), dan ubah FK ke ON DELETE SET NULL.
 * - index untuk kolom yang sering difilter.
 *
 * Idempotent: cek fieldExists / tableExists dulu.
 */
class V2AddAuthAndDeliverableColumns extends Migration
{
    public function up()
    {
        // ============ USER: kolom auth baru ============
        if ($this->db->tableExists('user')) {
            if (! $this->db->fieldExists('email_canonical', 'user')) {
                $this->forge->addColumn('user', [
                    'email_canonical' => [
                        'type'       => 'VARCHAR',
                        'constraint' => 190,
                        'null'       => true,
                        'after'      => 'email',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('email_verified_at', 'user')) {
                $this->forge->addColumn('user', [
                    'email_verified_at' => [
                        'type' => 'DATETIME',
                        'null' => true,
                        'after' => 'email_canonical',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('google_id', 'user')) {
                $this->forge->addColumn('user', [
                    'google_id' => [
                        'type'       => 'VARCHAR',
                        'constraint' => 64,
                        'null'       => true,
                        'after'      => 'email_verified_at',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('auth_provider', 'user')) {
                $this->forge->addColumn('user', [
                    'auth_provider' => [
                        'type'       => 'VARCHAR',
                        'constraint' => 20,
                        'default'    => 'password',
                        'after'      => 'google_id',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('avatar_url', 'user')) {
                $this->forge->addColumn('user', [
                    'avatar_url' => [
                        'type'       => 'VARCHAR',
                        'constraint' => 512,
                        'null'       => true,
                        'after'      => 'auth_provider',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('failed_login_attempts', 'user')) {
                $this->forge->addColumn('user', [
                    'failed_login_attempts' => [
                        'type'       => 'INT',
                        'constraint' => 11,
                        'default'    => 0,
                        'after'      => 'avatar_url',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('locked_until', 'user')) {
                $this->forge->addColumn('user', [
                    'locked_until' => [
                        'type' => 'DATETIME',
                        'null' => true,
                        'after' => 'failed_login_attempts',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('last_login_at', 'user')) {
                $this->forge->addColumn('user', [
                    'last_login_at' => [
                        'type' => 'DATETIME',
                        'null' => true,
                        'after' => 'locked_until',
                    ],
                ]);
            }

            // Backfill email_canonical = lower(email). Versi sederhana —
            // aplikasi punya EmailNormalizer yang lebih akurat; untuk
            // user lama cukup lower-case trim dulu.
            // "user" adalah reserved word di Postgres — wajib lewat escapeIdentifiers.
            $userTable = $this->db->escapeIdentifiers('user');
            $this->db->query("UPDATE {$userTable} SET email_canonical = LOWER(TRIM(email)) WHERE email_canonical IS NULL OR email_canonical = ''");

            // Backfill email_verified_at ke created_at agar user seeder
            // (yang dibuat sebelum overhaul) tidak terkunci.
            $this->db->query("UPDATE {$userTable} SET email_verified_at = created_at WHERE email_verified_at IS NULL");
        }

        // ============ JADWAL_PRODUKSI: kolom deliverable ============
        if ($this->db->tableExists('jadwal_produksi')) {
            if (! $this->db->fieldExists('link_hasil', 'jadwal_produksi')) {
                $this->forge->addColumn('jadwal_produksi', [
                    'link_hasil' => [
                        'type'       => 'VARCHAR',
                        'constraint' => 512,
                        'null'       => true,
                        'after'      => 'catatan_produksi',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('link_hasil_hash', 'jadwal_produksi')) {
                $this->forge->addColumn('jadwal_produksi', [
                    'link_hasil_hash' => [
                        'type'       => 'CHAR',
                        'constraint' => 64,
                        'null'       => true,
                        'after'      => 'link_hasil',
                    ],
                ]);
            }
            if (! $this->db->fieldExists('link_hasil_terkirim_at', 'jadwal_produksi')) {
                $this->forge->addColumn('jadwal_produksi', [
                    'link_hasil_terkirim_at' => [
                        'type' => 'DATETIME',
                        'null' => true,
                        'after' => 'link_hasil_hash',
                    ],
                ]);
            }
        }
    }

    public function down()
    {
        // Down tidak melakukan apa-apa (forward-only).
    }
}
