<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $tables = [
            'pengeluaran_operasional',
            'jadwal_produksi',
            'pembayaran',
            'detail_pemesanan',
            'pemesanan',
            'portofolio',
            'paket',
            'user',
        ];
        $existing = array_values(array_filter($tables, fn ($t) => $this->db->tableExists($t)));

        if ($this->db->DBDriver === 'Postgre') {
            // Postgres menolak TRUNCATE tabel yang direferensikan FK
            // (meski tabel anaknya kosong) — satu statement CASCADE.
            if ($existing !== []) {
                $list = implode(', ', array_map(fn ($t) => $this->db->escapeIdentifiers($t), $existing));
                $this->db->query("TRUNCATE {$list} RESTART IDENTITY CASCADE");
            }
        } else {
            // MySQL: matikan FK checks biar truncate aman
            $this->db->query('SET FOREIGN_KEY_CHECKS=0');
            foreach ($existing as $t) {
                $this->db->table($t)->truncate();
            }
            $this->db->query('SET FOREIGN_KEY_CHECKS=1');
        }

        $this->call('UserSeeder');
        $this->call('PaketSeeder');
        $this->call('PortofolioSeeder');
        $this->call('PemesananSeeder');
        $this->call('PembayaranSeeder');
        $this->call('JadwalProduksiSeeder');

        if ($this->db->tableExists('pengeluaran_operasional')) {
            $this->call('PengeluaranOperasionalSeeder');
        }
    }
}
