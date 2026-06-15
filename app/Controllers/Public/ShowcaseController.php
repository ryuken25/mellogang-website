<?php

namespace App\Controllers\Public;

use App\Controllers\BaseController;
use App\Models\PaketModel;
use App\Models\PortofolioModel;

class ShowcaseController extends BaseController
{
    /**
     * Halaman showcase / tour publik — di-embed dari halaman lain via
     * "Lihat showcase" CTA. Menampilkan gallery screenshot aplikasi
     * + tech stack + fitur highlight.
     */
    public function index()
    {
        $portoModel = new PortofolioModel();
        $paketModel = new PaketModel();

        // Ambil beberapa portofolio (real photos) buat highlight strip
        $portos = $portoModel->orderBy('id_portfolio', 'DESC')->findAll(6);
        foreach ($portos as &$po) {
            $thumb = base_url('assets/images/porto_placeholder.png');
            $thumbName = (string)($po['thumbnail'] ?? '');
            if ($thumbName !== '') {
                $thumb = base_url('uploads/portofolio/' . $thumbName);
            }
            $po['thumb'] = $thumb;
        }
        unset($po);

        // Paket populer
        $paket = $paketModel->where('is_active', 1)->orderBy('harga', 'ASC')->findAll(3);

        // Screenshot list (yang sudah di-capture oleh tools/screenshots/capture.js)
        $base = ROOTPATH . 'pages' . DIRECTORY_SEPARATOR . 'screenshots';
        $shotGroups = [
            'publik' => [
                'label' => 'Public pages',
                'icon'  => 'globe',
                'shots' => $this->collectShots($base . DIRECTORY_SEPARATOR . 'publik'),
            ],
            'pelanggan' => [
                'label' => 'Customer dashboard',
                'icon'  => 'user',
                'shots' => $this->collectShots($base . DIRECTORY_SEPARATOR . 'pelanggan'),
            ],
            'admin' => [
                'label' => 'Admin panel',
                'icon'  => 'shield',
                'shots' => $this->collectShots($base . DIRECTORY_SEPARATOR . 'admin'),
            ],
            'editor' => [
                'label' => 'Editor workspace',
                'icon'  => 'edit',
                'shots' => $this->collectShots($base . DIRECTORY_SEPARATOR . 'editor'),
            ],
        ];

        $features = [
            [
                'eyebrow' => 'AUTH',
                'title'    => 'Sign-in that works for everyone',
                'body'     => 'Email + OTP, Google OAuth, lockout after 4 failed attempts, anti-dot-trick email normalization.',
                'icon'     => 'key',
            ],
            [
                'eyebrow' => 'I18N',
                'title'    => 'EN + ID, in one cookie',
                'body'     => 'Language switcher in the topbar persists via the mllang cookie. Login UI stays English by spec.',
                'icon'     => 'globe',
            ],
            [
                'eyebrow' => 'FLOW',
                'title'    => 'Order to delivery, tracked',
                'body'     => 'Pelanggan pesan -> verifikasi bayar -> jadwal -> editor progress -> serah terima via Google Drive.',
                'icon'     => 'flow',
            ],
            [
                'eyebrow' => 'DELIVER',
                'title'    => 'Google Drive links, no storage',
                'body'     => 'Editor/admin paste a Drive URL. App only stores and forwards. "Hasil siap" email is idempotent via sha256.',
                'icon'     => 'link',
            ],
            [
                'eyebrow' => 'STACK',
                'title'    => 'Dark cinematic, self-hosted',
                'body'     => 'CodeIgniter 4.7, MySQL, custom CSS with Space Grotesk + Inter. No CDN, no tracking, no AI look.',
                'icon'     => 'stack',
            ],
            [
                'eyebrow' => 'SPEED',
                'title'    => 'Pages snap to life',
                'body'     => 'IntersectionObserver reveals + mouse parallax + tile tilt + smooth horizontal scroll carousels.',
                'icon'     => 'spark',
            ],
        ];

        $stack = [
            'PHP 8.2', 'CodeIgniter 4.7', 'MySQL', 'Composer',
            'Node.js', 'Playwright', 'Remotion', 'Dompdf',
            'OAuth (Google)', 'SMTP (CI4 Email)', 'Self-hosted fonts',
        ];

        return view('public/showcase/index', [
            'title'      => 'Showcase',
            'portos'     => $portos,
            'paket'      => $paket,
            'shotGroups' => $shotGroups,
            'features'   => $features,
            'stack'      => $stack,
        ]);
    }

    /**
     * Kumpulkan file screenshot dalam folder tertentu. Skip folder
     * audit, hanya ambil -desktop / -mobile.
     */
    private function collectShots(string $dir): array
    {
        if (! is_dir($dir)) {
            return [];
        }
        $shots = [];
        foreach (new \DirectoryIterator($dir) as $f) {
            if ($f->isDot() || ! $f->isFile()) continue;
            $name = $f->getFilename();
            if (! preg_match('/-(desktop|mobile)\.png$/', $name)) continue;
            $base = (string) $f->getBasename('.png');
            $label = preg_replace('/-(desktop|mobile)$/', '', $base);
            $label = ucwords(str_replace('-', ' ', $label));
            $shots[] = [
                'file'  => 'pages/screenshots/' . basename(dirname($dir)) . '/' . $name,
                'label' => $label,
                'view'  => str_ends_with($name, '-mobile.png') ? 'mobile' : 'desktop',
                'url'   => $this->guessUrl($label, $name),
            ];
        }
        return $shots;
    }

    /**
     * Map label + view ke URL app asli, kalau bisa ditebak.
     */
    private function guessUrl(string $label, string $name): ?string
    {
        $map = [
            'home'         => '/',
            'katalog'      => '/katalog',
            'portofolio'   => '/portofolio',
            'kontak'       => '/kontak',
            'status'       => '/status-pesanan',
            'status kode'  => '/status-pesanan?kode=MLG',
            'login'        => '/login',
            'register'     => '/register',
            'verify otp'   => '/auth/verify?email=demo@mellogang.test',
            'unlock'       => '/auth/unlock',
        ];
        $key = strtolower($label);
        return $map[$key] ?? null;
    }
}
