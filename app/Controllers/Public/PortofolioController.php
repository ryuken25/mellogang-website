<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\PaketModel;
use App\Models\PortofolioModel;
use App\Models\SocialPostModel;

class PortofolioController extends BaseController
{
    public function index()
    {
        $portoModel = new PortofolioModel();
        $paketModel = new PaketModel();

        // Ambil dari tabel portofolio tradisional
        $items = $portoModel->orderBy('id_portfolio', 'DESC')->findAll();

        // Map nama paket
        $paketMap = [];
        foreach ($paketModel->findAll() as $p) {
            $paketMap[$p['id_paket']] = $p['nama_paket'];
        }

        // Tambah dari cache social_post (featured) — yang di-fetch via
        // tombol admin, BUKAN scraping saat visitor buka.
        try {
            $social = (new SocialPostModel())
                ->orderBy('posted_at', 'DESC')
                ->findAll(24);
            foreach ($social as $s) {
                if (empty($s['thumbnail_url']) && empty($s['media_url'])) {
                    continue;
                }
                $items[] = [
                    'id_portfolio'      => 'soc_' . $s['id'],
                    'id_paket'          => null,
                    'judul'             => $s['title'] ?: ($s['caption'] ?: ucfirst((string) $s['platform'])),
                    'deskripsi'         => $s['caption'] ?? '',
                    'kategori'          => strtoupper((string) ($s['platform'] ?? '')),
                    'url_media'         => $s['permalink'] ?? '',
                    'thumbnail'         => null,
                    'thumb'             => $s['thumbnail_url'] ?: ($s['media_url'] ?? ''),
                    'tanggal_publikasi' => $s['posted_at'] ?? null,
                    'is_featured'       => ! empty($s['is_featured']),
                    'is_social'         => true,
                ];
            }
        } catch (\Throwable $e) {
            // tabel social_post belum ada / migration belum jalan → diam
        }

        // Compute thumb untuk portofolio tradisional
        foreach ($items as &$po) {
            if (! empty($po['thumb'])) {
                continue; // sudah di-set dari social_post
            }
            $thumb = base_url('assets/images/porto_placeholder.png');
            $thumbName = (string)($po['thumbnail'] ?? '');
            if ($thumbName !== '') {
                $thumb = base_url('uploads/portofolio/' . $thumbName);
            } else {
                $url = (string)($po['url_media'] ?? '');
                if (preg_match('~\.(jpg|jpeg|png|webp|gif)(\?.*)?$~i', $url)) $thumb = $url;
                if (preg_match('~youtu\.be/([^/?]+)~', $url, $m)) $thumb = 'https://img.youtube.com/vi/'.$m[1].'/hqdefault.jpg';
                if (preg_match('~v=([^&]+)~', $url, $m)) $thumb = 'https://img.youtube.com/vi/'.$m[1].'/hqdefault.jpg';
            }
            $po['thumb'] = $thumb;
        }
        unset($po);

        return view('public/portofolio/index', [
            'title' => 'Portofolio',
            'items' => $items,
            'paketMap' => $paketMap,
        ]);
    }
}
