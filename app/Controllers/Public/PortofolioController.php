<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\PaketModel;
use App\Models\PortofolioModel;
use App\Models\SocialPostModel;

class PortofolioController extends BaseController
{
    /** @var string[] kategori kanonik */
    private const CATEGORIES = [
        'wedding', 'corporate', 'product', 'event',
    ];

    public function index()
    {
        $portoModel = new PortofolioModel();
        $paketModel = new PaketModel();

        $items = $portoModel->orderBy('id_portfolio', 'DESC')->findAll();

        $paketMap = [];
        foreach ($paketModel->findAll() as $p) {
            $paketMap[$p['id_paket']] = $p['nama_paket'];
        }

        // Hitung thumb: prioritaskan kolom `thumbnail` (file lokal),
        // fallback ke `url_media`, lalu placeholder.
        foreach ($items as &$po) {
            $thumb = base_url('assets/images/porto_placeholder.png');
            $thumbName = (string)($po['thumbnail'] ?? '');
            if ($thumbName !== '') {
                $thumb = base_url('uploads/portofolio/' . $thumbName);
            } else {
                $url = (string)($po['url_media'] ?? '');
                if ($url !== '' && preg_match('~\.(jpg|jpeg|png|webp|gif)(\?.*)?$~i', $url)) {
                    $thumb = $url;
                } elseif (preg_match('~youtu\.be/([^/?]+)~', $url, $m)) {
                    $thumb = 'https://img.youtube.com/vi/' . $m[1] . '/hqdefault.jpg';
                } elseif (preg_match('~v=([^&]+)~', $url, $m)) {
                    $thumb = 'https://img.youtube.com/vi/' . $m[1] . '/hqdefault.jpg';
                }
            }
            $po['thumb'] = $thumb;
            $po['kategori'] = strtolower((string)($po['kategori'] ?? 'event'));
            if (! in_array($po['kategori'], self::CATEGORIES, true)) {
                $po['kategori'] = 'event';
            }
        }
        unset($po);

        // Tambahkan item dari cache social_post (kalau ada)
        try {
            $social = (new SocialPostModel())
                ->orderBy('posted_at', 'DESC')
                ->findAll(12);
            foreach ($social as $s) {
                if (empty($s['thumbnail_url']) && empty($s['media_url'])) continue;
                $items[] = [
                    'id_portfolio'      => 'soc_' . $s['id'],
                    'id_paket'          => null,
                    'judul'             => $s['title'] ?: ($s['caption'] ?: ucfirst((string) $s['platform'])),
                    'deskripsi'         => $s['caption'] ?? '',
                    'kategori'          => strtolower((string) ($s['platform'] ?? 'event')),
                    'url_media'         => $s['permalink'] ?? '',
                    'thumbnail'         => null,
                    'thumb'             => $s['thumbnail_url'] ?: ($s['media_url'] ?? ''),
                    'tanggal_publikasi' => $s['posted_at'] ?? null,
                    'is_featured'       => ! empty($s['is_featured']),
                    'is_social'         => true,
                ];
            }
        } catch (\Throwable $e) {
            // tabel belum ada → diam
        }

        // Pisahkan featured dan sisanya
        $featured = array_values(array_filter($items, fn($i) => ! empty($i['is_featured'])));
        $rest     = array_values(array_filter($items, fn($i) => empty($i['is_featured'])));
        if (empty($featured)) {
            $featured = array_slice($rest, 0, 6);
            $rest     = array_slice($rest, 6);
        }

        return view('public/portofolio/index', [
            'title'      => 'Portfolio',
            'featured'   => $featured,
            'items'      => $rest,
            'paketMap'   => $paketMap,
            'categories' => self::CATEGORIES,
        ]);
    }
}
