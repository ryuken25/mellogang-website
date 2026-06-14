<?php

namespace App\Database\Seeds;

use CodeIgniter\Database\Seeder;

class PortofolioSeeder extends Seeder
{
    public function run()
    {
        $table = 'portofolio';
        $now = date('Y-m-d H:i:s');

        // Picsum images yang sudah di-download ke public/uploads/portofolio/
        $items = [
            ['slug' => 'wedding-premium-full-day',   'kategori' => 'wedding',   'paket' => 6, 'days_ago' => 30],
            ['slug' => 'wedding-highlight-teaser',   'kategori' => 'wedding',   'paket' => 5, 'days_ago' => 50],
            ['slug' => 'wedding-cinematic-bali',    'kategori' => 'wedding',   'paket' => 6, 'days_ago' => 75],
            ['slug' => 'wedding-prewedding-jogja',   'kategori' => 'wedding',   'paket' => 5, 'days_ago' => 100],
            ['slug' => 'corporate-mini-profile',     'kategori' => 'corporate', 'paket' => 4, 'days_ago' => 20],
            ['slug' => 'corporate-launching',       'kategori' => 'corporate', 'paket' => 4, 'days_ago' => 45],
            ['slug' => 'corporate-interview',       'kategori' => 'corporate', 'paket' => 4, 'days_ago' => 70],
            ['slug' => 'product-cinematic-showcase', 'kategori' => 'product',   'paket' => 3, 'days_ago' => 15],
            ['slug' => 'product-food-beverage',     'kategori' => 'product',   'paket' => 3, 'days_ago' => 40],
            ['slug' => 'product-fashion-lookbook',  'kategori' => 'product',   'paket' => 3, 'days_ago' => 65],
            ['slug' => 'event-reels-highlight-01',   'kategori' => 'event',     'paket' => 2, 'days_ago' => 25],
            ['slug' => 'event-highlight-02',         'kategori' => 'event',     'paket' => 2, 'days_ago' => 55],
            ['slug' => 'event-concert-stage',       'kategori' => 'event',     'paket' => 2, 'days_ago' => 85],
            ['slug' => 'event-sport-motocross',     'kategori' => 'event',     'paket' => 2, 'days_ago' => 120],
        ];

        $descs = [
            'wedding'   => 'Wedding cinematic dengan color grading premium, dokumentasi penuh dari pra-acara hingga resepsi.',
            'corporate' => 'Company profile dengan storytelling rapi, tone profesional, dan output multi-format.',
            'product'   => 'Video produk cinematic untuk promosi brand, durasi pendek dengan impact tinggi.',
            'event'     => 'Highlight event dengan cut cepat, color grading sinematik, dan musik yang pas.',
        ];

        $baseUrl = rtrim(base_url(), '/');

        $rows = [];
        foreach ($items as $it) {
            $filename = $it['slug'] . '.jpg';
            $rows[] = [
                'id_paket'           => $it['paket'],
                'judul'              => ucwords(str_replace('-', ' ', $it['slug'])),
                'deskripsi'          => $descs[$it['kategori']] ?? 'Karya MellogangVisuals.',
                'kategori'           => $it['kategori'],
                'url_media'          => $baseUrl . '/uploads/portofolio/' . $filename,
                'thumbnail'          => $filename,
                'tanggal_publikasi'  => date('Y-m-d', strtotime('-' . $it['days_ago'] . ' days')),
                'created_at'         => $now,
                'updated_at'         => $now,
            ];
        }

        if (! empty($rows)) {
            // Idempotent: hapus dulu kalau ada duplicate
            $this->db->table($table)->truncate();
            $this->db->table($table)->insertBatch($rows);
        }
    }
}
