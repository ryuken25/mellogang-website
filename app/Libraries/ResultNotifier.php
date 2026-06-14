<?php

namespace App\Libraries;

use App\Models\AuthTokenModel;
use App\Support\Status;

/**
 * Helper untuk mengirim email "hasil siap" yang IDEMPOTENT.
 * Lihat DECISIONS.md §6.4.
 *
 * Aturan:
 *   - Hanya kirim kalau ada link_hasil.
 *   - Hitung sha256(link) dan bandingkan dengan link_hasil_hash.
 *   - Kalau hash sama → return false (skip, sudah pernah terkirim).
 *   - Kalau beda / null → kirim, update hash + timestamp.
 */
final class ResultNotifier
{
    public function __construct(
        private Mailer $mailer,
    ) {}

    /**
     * @return bool true = terkirim (atau sudah pernah); false = tidak ada link / gagal
     */
    public function notifyIfNeeded(array $jadwal, array $order, array $user, array $paket): bool
    {
        $link = trim((string) ($jadwal['link_hasil'] ?? ''));
        if ($link === '') {
            return false;
        }

        $hash = hash('sha256', $link);
        $prev = (string) ($jadwal['link_hasil_hash'] ?? '');
        if ($hash === $prev) {
            return true; // sudah pernah terkirim
        }

        if (empty($user['email'])) {
            return false;
        }

        $ok = $this->mailer->send(
            (string) $user['email'],
            'Hasil Foto/Video Siap Diunduh — ' . ($order['kode_pemesanan'] ?? ''),
            'result_ready',
            [
                'nama'      => $user['nama_lengkap'] ?? '',
                'kode'      => $order['kode_pemesanan'] ?? '',
                'linkDrive' => $link,
                'namaPaket' => $paket['nama_paket'] ?? '',
            ]
        );

        if ($ok) {
            $db = \Config\Database::connect();
            $db->table('jadwal_produksi')
                ->where('id_jadwal', (int) $jadwal['id_jadwal'])
                ->update([
                    'link_hasil_hash'        => $hash,
                    'link_hasil_terkirim_at' => date('Y-m-d H:i:s'),
                ]);
        }
        return $ok;
    }

    /**
     * Validasi link Drive — harus host drive.google.com / docs.google.com
     * dan pakai http(s).
     */
    public static function isValidDriveLink(string $url): bool
    {
        if (! preg_match('~^https?://~i', $url)) {
            return false;
        }
        $host = strtolower((string) parse_url($url, PHP_URL_HOST));
        $allowed = [
            'drive.google.com', 'docs.google.com',
        ];
        foreach ($allowed as $a) {
            if ($host === $a || str_ends_with($host, '.' . $a)) {
                return true;
            }
        }
        return false;
    }
}
