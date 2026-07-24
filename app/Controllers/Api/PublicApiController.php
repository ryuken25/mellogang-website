<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\PaketModel;
use App\Models\PortofolioModel;
use App\Models\SocialPostModel;
use CodeIgniter\HTTP\ResponseInterface;

class PublicApiController extends BaseController
{
    private const CATEGORIES = ['wedding', 'corporate', 'product', 'event', 'prewedding', 'graduation', 'creative'];

    private function json(array $payload, int $status = 200): ResponseInterface
    {
        // Header CORS diurus filter 'cors' (app/Config/Cors.php) — jangan
        // reflect Origin manual di sini (dulu reflective + credentials=true,
        // itu setara wildcard berkredensial).
        return $this->response
            ->setStatusCode($status)
            ->setJSON($payload);
    }

    public function packages(): ResponseInterface
    {
        $items = (new PaketModel())
            ->where('is_active', 1)
            ->orderBy('id_paket', 'DESC')
            ->findAll();

        return $this->json(['data' => $items]);
    }

    public function portfolio(): ResponseInterface
    {
        $items = (new PortofolioModel())
            ->orderBy('id_portfolio', 'DESC')
            ->findAll();

        foreach ($items as &$item) {
            $item['kategori'] = strtolower((string)($item['kategori'] ?? 'event'));
            if (! in_array($item['kategori'], self::CATEGORIES, true)) {
                $item['kategori'] = 'event';
            }
            $item['thumb'] = $this->portfolioThumb($item);
        }
        unset($item);

        try {
            $social = (new SocialPostModel())->orderBy('posted_at', 'DESC')->findAll(12);
            foreach ($social as $post) {
                if (empty($post['thumbnail_url']) && empty($post['media_url'])) {
                    continue;
                }
                $items[] = [
                    'id_portfolio' => 'soc_' . $post['id'],
                    'id_paket' => null,
                    'judul' => $post['title'] ?: ($post['caption'] ?: ucfirst((string) $post['platform'])),
                    'deskripsi' => $post['caption'] ?? '',
                    'kategori' => strtolower((string) ($post['platform'] ?? 'event')),
                    'url_media' => $post['permalink'] ?? '',
                    'thumbnail' => null,
                    'thumb' => $post['thumbnail_url'] ?: ($post['media_url'] ?? ''),
                    'tanggal_publikasi' => $post['posted_at'] ?? null,
                    'is_featured' => ! empty($post['is_featured']),
                    'is_social' => true,
                ];
            }
        } catch (\Throwable $e) {
            // Social tables may not be migrated yet.
        }

        return $this->json(['data' => $items]);
    }

    public function brand(): ResponseInterface
    {
        return $this->json([
            'data' => [
                'name' => 'Mellogang Visuals',
                'handle' => '@mellogangvisuals',
                'tagline' => 'Capture Your Moment, Tell Your Story.',
                'description' => 'Professional photo and video production for weddings, ceremonies, graduations, events, and creative stories in Bali.',
                'location' => 'Bali, Indonesia',
                'linktree' => 'https://linktr.ee/mellogangvisuals',
                'instagram' => 'https://www.instagram.com/mellogangvisuals/',
                'youtube' => 'https://www.youtube.com/@mellogangvisuals',
                'linkedin' => 'https://www.linkedin.com/in/kadek-darmadi-8674a2241/',
                'whatsapp' => 'https://wa.me/+6282236004917',
                'joined' => 'November 2021',
                'timezone' => 'Asia/Makassar',
                'country' => 'ID',
                'theme' => [
                    'key' => 'air-black',
                    'background' => '#2A3236',
                    'accent' => '#00f0c0',
                    'accentDeep' => '#10b090',
                    'charcoal' => '#202020',
                ],
            ],
        ]);
    }

    public function orderStatus(): ResponseInterface
    {
        $kode = trim((string) $this->request->getGet('kode'));
        if ($kode === '') {
            return $this->json([
                'error' => 'Parameter kode wajib diisi.',
            ], 422);
        }

        $db = db_connect();
        $order = $db->table('pemesanan p')
            ->select('p.id_pemesanan, p.kode_pemesanan, p.tanggal_acara, p.lokasi_acara, p.status_pemesanan, p.total_biaya, p.catatan_admin, u.nama_lengkap, pk.nama_paket')
            ->join('user u', 'u.id_user = p.id_user', 'left')
            ->join('paket pk', 'pk.id_paket = p.id_paket', 'left')
            ->where('p.kode_pemesanan', $kode)
            ->get()->getRowArray();

        if (! $order) {
            return $this->json(['data' => null], 404);
        }

        $jadwal = $db->table('jadwal_produksi')
            ->where('id_pemesanan', (int) $order['id_pemesanan'])
            ->orderBy('id_jadwal', 'DESC')
            ->get()->getRowArray();

        $payments = $db->table('pembayaran')
            ->select('jenis_pembayaran, jumlah_bayar, status_verifikasi')
            ->where('id_pemesanan', (int) $order['id_pemesanan'])
            ->get()->getResultArray();

        $totalValid = 0;
        foreach ($payments as $payment) {
            if (strtolower((string) $payment['status_verifikasi']) === 'valid') {
                $totalValid += (int) $payment['jumlah_bayar'];
            }
        }

        $statusProduksi = (string)($jadwal['status_produksi'] ?? 'pra_produksi');
        $progressMap = [
            'pra_produksi' => 20,
            'shooting' => 38,
            'cut_to_cut' => 58,
            'cut-to-cut' => 58,
            'finishing' => 78,
            'revisi' => 84,
            'revisi_selesai' => 95,
            'revisi selesai' => 95,
            'done' => 100,
        ];
        $progress = $progressMap[strtolower($statusProduksi)] ?? 30;

        $order['jadwal'] = $jadwal;
        $order['payments'] = $payments;
        $order['total_terverifikasi'] = $totalValid;
        $order['status_produksi'] = $statusProduksi;
        $order['progress'] = $progress;

        return $this->json(['data' => $order]);
    }

    private function portfolioThumb(array $item): string
    {
        $thumbName = (string)($item['thumbnail'] ?? '');
        if ($thumbName !== '') {
            return base_url('uploads/portofolio/' . $thumbName);
        }

        $url = (string)($item['url_media'] ?? '');
        if ($url !== '' && preg_match('~\.(jpg|jpeg|png|webp|gif)(\?.*)?$~i', $url)) {
            return $url;
        }
        if (preg_match('~youtu\.be/([^/?]+)~', $url, $m) || preg_match('~v=([^&]+)~', $url, $m)) {
            return 'https://img.youtube.com/vi/' . $m[1] . '/hqdefault.jpg';
        }

        return base_url('assets/images/porto_placeholder.png');
    }
}
