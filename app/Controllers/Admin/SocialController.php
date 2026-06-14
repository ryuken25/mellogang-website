<?php

namespace App\Controllers\Admin;

use App\Controllers\BaseController;
use App\Models\SocialFetchJobModel;
use App\Models\SocialPostModel;

class SocialController extends BaseController
{
    public function index()
    {
        $jobs = (new SocialFetchJobModel())
            ->orderBy('id', 'DESC')
            ->limit(10)
            ->findAll();

        $posts = (new SocialPostModel())
            ->orderBy('posted_at', 'DESC')
            ->limit(24)
            ->findAll();

        return view('admin/social/index', [
            'title'  => 'Social Cache',
            'jobs'   => $jobs,
            'posts'  => $posts,
            'ytUrl'  => env('YT_CHANNEL_URL', 'https://www.youtube.com/@mellogangvisuals/videos'),
            'igUrl'  => 'https://www.instagram.com/' . ltrim((string) env('IG_HANDLE', 'mellogangvisuals'), '@') . '/',
        ]);
    }

    /**
     * POST /admin/social/fetch  (admin only, CSRF)
     * Spawn worker Node Playwright di background, return job_id.
     */
    public function fetch()
    {
        // Throttle by user ID: max 1 job / 30 detik
        $userId = (int) session('id_user');
        $throttler = \Config\Services::throttler();
        $key = 'socialfetch_' . $userId;
        if ($throttler->check($key, 1, 30) === false) {
            return $this->response->setStatusCode(429)->setJSON([
                'ok'    => false,
                'error' => 'Tunggu 30 detik sebelum fetch lagi.',
            ]);
        }

        $jobs = new SocialFetchJobModel();
        $jobId = $jobs->insert([
            'status'       => SocialFetchJobModel::STATUS_QUEUED,
            'platforms'    => 'youtube,instagram',
            'triggered_by' => $userId,
            'created_at'   => date('Y-m-d H:i:s'),
        ], true);

        // Path ke worker Node
        $worker = realpath(ROOTPATH . '../tools/social-fetcher/worker.js');
        if (! $worker || ! is_file($worker)) {
            $jobs->update($jobId, [
                'status'      => SocialFetchJobModel::STATUS_FAILED,
                'finished_at' => date('Y-m-d H:i:s'),
                'message'     => 'Worker Node belum tersedia di tools/social-fetcher/worker.js. Install Playwright dulu (lihat README).',
            ]);
            return $this->response->setJSON([
                'ok'    => false,
                'jobId' => $jobId,
                'error' => 'Worker Node tidak ditemukan.',
            ]);
        }

        // Spawn background process
        $apiBase = rtrim(base_url(), '/');
        $logFile = WRITEPATH . 'logs/social-fetch-' . $jobId . '.log';

        // Pakai start /B di Windows untuk background.
        $node = $this->resolveNode();
        $cmd  = escapeshellcmd($node) . ' ' . escapeshellarg($worker)
            . ' --job=' . (int) $jobId
            . ' --api=' . escapeshellarg($apiBase)
            . ' >> ' . escapeshellarg($logFile) . ' 2>&1';

        // Windows: pakai "start /B" lewat cmd.exe
        if (DIRECTORY_SEPARATOR === '\\') {
            $cmd = 'cmd.exe /C start /B "" ' . $cmd;
        } else {
            $cmd = $cmd . ' &';
        }

        @exec($cmd);

        return $this->response->setJSON([
            'ok'    => true,
            'jobId' => (int) $jobId,
        ]);
    }

    public function status($id)
    {
        $id = (int) $id;
        $job = (new SocialFetchJobModel())->find($id);
        if (! $job) {
            return $this->response->setStatusCode(404)->setJSON(['ok' => false]);
        }
        return $this->response->setJSON(['ok' => true, 'job' => $job]);
    }

    public function cache()
    {
        $platform = $this->request->getGet('platform');
        $b = (new SocialPostModel())->orderBy('posted_at', 'DESC')->limit(48);
        if ($platform) {
            $b->where('platform', $platform);
        }
        $items = $b->findAll();
        return $this->response->setJSON(['ok' => true, 'items' => $items]);
    }

    public function feature($id)
    {
        $id = (int) $id;
        $model = new SocialPostModel();
        $row = $model->find($id);
        if (! $row) {
            return $this->response->setStatusCode(404)->setJSON(['ok' => false]);
        }
        $model->update($id, ['is_featured' => $row['is_featured'] ? 0 : 1]);
        return $this->response->setJSON(['ok' => true, 'is_featured' => $row['is_featured'] ? 0 : 1]);
    }

    /**
     * POST /admin/social/upsert  (dipanggil oleh worker Node)
     * Body: { platform: "youtube"|"instagram", items: [...] }
     * Upsert ke social_post by (platform, external_id). Tidak menghapus
     * data lama (anti-duplikat).
     */
    public function upsert()
    {
        // Auth: harus admin (sudah dijaga group 'admin' di Routes).
        // Cegah akses dari worker random — butuh header X-Worker dan IP
        // yang dikenal (loopback). Untuk MVP, andalkan session admin.
        $platform = (string) $this->request->getPost('platform');
        $items    = (string) $this->request->getPost('items');

        if (str_starts_with($platform, '{')) {
            $json = json_decode($platform, true);
            $platform = is_array($json) ? ($json['platform'] ?? '') : '';
        }
        $body = $this->request->getJSON(true) ?: [];
        $platform = $body['platform'] ?? $platform;
        $items    = $body['items'] ?? json_decode($items, true) ?? [];

        if (! in_array($platform, [SocialPostModel::PLATFORM_YOUTUBE, SocialPostModel::PLATFORM_INSTAGRAM], true)) {
            return $this->response->setStatusCode(400)->setJSON(['ok' => false, 'error' => 'Platform tidak valid.']);
        }
        if (! is_array($items) || empty($items)) {
            return $this->response->setJSON(['ok' => true, 'inserted' => 0, 'updated' => 0]);
        }

        $model = new SocialPostModel();
        $inserted = 0;
        $updated = 0;
        $now = date('Y-m-d H:i:s');

        foreach ($items as $it) {
            $externalId = (string) ($it['external_id'] ?? '');
            if ($externalId === '') {
                continue;
            }
            $existing = $model->where('platform', $platform)
                ->where('external_id', $externalId)
                ->first();
            $payload = [
                'platform'      => $platform,
                'external_id'   => $externalId,
                'type'          => (string) ($it['type'] ?? ''),
                'title'         => (string) ($it['title'] ?? ''),
                'caption'       => (string) ($it['caption'] ?? ''),
                'media_url'     => (string) ($it['media_url'] ?? ''),
                'thumbnail_url' => (string) ($it['thumbnail_url'] ?? ''),
                'permalink'     => (string) ($it['permalink'] ?? ''),
                'posted_at'     => (string) ($it['posted_at'] ?? null) ?: null,
                'fetched_at'    => $now,
                'raw'           => json_encode($it, JSON_UNESCAPED_UNICODE),
            ];
            if ($existing) {
                $model->update((int) $existing['id'], $payload);
                $updated++;
            } else {
                $payload['is_featured'] = 0;
                $model->insert($payload);
                $inserted++;
            }
        }

        return $this->response->setJSON([
            'ok' => true,
            'inserted' => $inserted,
            'updated'  => $updated,
        ]);
    }

    private function resolveNode(): string
    {
        // Coba "node" di PATH
        $cmd = DIRECTORY_SEPARATOR === '\\'
            ? 'where node 2>NUL'
            : 'command -v node';
        $out = @shell_exec($cmd);
        if ($out) {
            $line = trim(explode("\n", trim($out))[0]);
            if ($line !== '') {
                return $line;
            }
        }
        return 'node';
    }
}
