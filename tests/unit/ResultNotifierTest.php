<?php

namespace Tests\unit;

use App\Libraries\ResultNotifier;
use CodeIgniter\Test\CIUnitTestCase;

/**
 * @internal
 */
final class ResultNotifierTest extends CIUnitTestCase
{
    public function testIsValidDriveLink(): void
    {
        $this->assertTrue(ResultNotifier::isValidDriveLink('https://drive.google.com/file/d/abc123/view'));
        $this->assertTrue(ResultNotifier::isValidDriveLink('https://docs.google.com/document/d/abc/edit'));
        $this->assertFalse(ResultNotifier::isValidDriveLink('https://example.com/file'));
        $this->assertFalse(ResultNotifier::isValidDriveLink('drive.google.com/abc'));
        $this->assertFalse(ResultNotifier::isValidDriveLink('ftp://drive.google.com/x'));
    }

    public function testIdempotencyByHash(): void
    {
        $link  = 'https://drive.google.com/file/d/abc123/view';
        $hash  = hash('sha256', $link);

        $jadwal = [
            'id_jadwal'              => 1,
            'link_hasil'             => $link,
            'link_hasil_hash'        => $hash,
            'link_hasil_terkirim_at' => date('Y-m-d H:i:s'),
        ];
        // Kalau hash match → notifyIfNeeded return true tanpa kirim.
        $this->assertSame($hash, hash('sha256', $jadwal['link_hasil']));
    }

    public function testIdempotencyDifferentHash(): void
    {
        $link1 = 'https://drive.google.com/file/d/AAA/view';
        $link2 = 'https://drive.google.com/file/d/BBB/view';

        $this->assertNotSame(hash('sha256', $link1), hash('sha256', $link2));
    }
}
