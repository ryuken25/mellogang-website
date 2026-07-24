<?php

use App\Services\MidtransService;
use App\Support\Status;
use CodeIgniter\Test\CIUnitTestCase;
use Config\Midtrans as MidtransConfig;

/**
 * @internal
 */
final class MidtransServiceTest extends CIUnitTestCase
{
    private const SERVER_KEY = 'SB-Mid-server-TESTKEY123';

    private function service(): MidtransService
    {
        $config            = new MidtransConfig();
        $config->serverKey = self::SERVER_KEY;
        $config->clientKey = 'SB-Mid-client-TESTKEY123';

        return new MidtransService($config);
    }

    private function signedPayload(string $orderId, string $statusCode, string $gross): array
    {
        return [
            'order_id'      => $orderId,
            'status_code'   => $statusCode,
            'gross_amount'  => $gross,
            'signature_key' => hash('sha512', $orderId . $statusCode . $gross . self::SERVER_KEY),
        ];
    }

    // ---------- signature ----------

    public function testVerifySignatureValid(): void
    {
        $payload = $this->signedPayload('MG-7-1750000000', '200', '1500000.00');
        $this->assertTrue($this->service()->verifySignature($payload));
    }

    public function testVerifySignatureInvalidKey(): void
    {
        $payload                  = $this->signedPayload('MG-7-1750000000', '200', '1500000.00');
        $payload['signature_key'] = str_repeat('0', 128);
        $this->assertFalse($this->service()->verifySignature($payload));
    }

    public function testVerifySignatureTamperedAmount(): void
    {
        $payload                 = $this->signedPayload('MG-7-1750000000', '200', '1500000.00');
        $payload['gross_amount'] = '1.00'; // diubah setelah ditandatangani
        $this->assertFalse($this->service()->verifySignature($payload));
    }

    public function testVerifySignatureMissingFields(): void
    {
        $this->assertFalse($this->service()->verifySignature([]));
    }

    // ---------- mapStatus ----------

    /**
     * @dataProvider statusMapProvider
     */
    public function testMapStatus(string $tx, ?string $fraud, string $expected): void
    {
        $this->assertSame($expected, $this->service()->mapStatus($tx, $fraud));
    }

    public static function statusMapProvider(): array
    {
        return [
            'settlement'          => ['settlement', null, Status::VERIF_VALID],
            'capture accept'      => ['capture', 'accept', Status::VERIF_VALID],
            'capture no fraud'    => ['capture', null, Status::VERIF_VALID],
            'capture challenge'   => ['capture', 'challenge', Status::VERIF_MENUNGGU],
            'pending'             => ['pending', null, Status::VERIF_MENUNGGU],
            'deny'                => ['deny', null, Status::VERIF_DITOLAK],
            'cancel'              => ['cancel', null, Status::VERIF_DITOLAK],
            'expire'              => ['expire', null, Status::VERIF_DITOLAK],
            'failure'             => ['failure', null, Status::VERIF_DITOLAK],
            'unknown -> menunggu' => ['weird_status', null, Status::VERIF_MENUNGGU],
            'case-insensitive'    => ['SETTLEMENT', null, Status::VERIF_VALID],
        ];
    }

    // ---------- idempotency / precedence (webhook guard) ----------

    public function testSamePayloadTwiceOnlyOneStateChange(): void
    {
        $svc = $this->service();

        // Payload settlement pertama: menunggu -> valid = boleh apply.
        $new = $svc->mapStatus('settlement');
        $this->assertTrue($svc->shouldApply(Status::VERIF_MENUNGGU, $new));

        // Payload IDENTIK kedua: status sudah valid -> tidak ada perubahan.
        $this->assertFalse($svc->shouldApply(Status::VERIF_VALID, $new));
    }

    public function testNeverDowngradeFromValid(): void
    {
        $svc = $this->service();
        $this->assertFalse($svc->shouldApply(Status::VERIF_VALID, Status::VERIF_MENUNGGU));
        $this->assertFalse($svc->shouldApply(Status::VERIF_VALID, Status::VERIF_DITOLAK));
    }

    public function testUpgradePathAllowed(): void
    {
        $svc = $this->service();
        $this->assertTrue($svc->shouldApply(Status::VERIF_MENUNGGU, Status::VERIF_DITOLAK)); // expire
        $this->assertTrue($svc->shouldApply(Status::VERIF_DITOLAK, Status::VERIF_VALID));    // late settle
        $this->assertFalse($svc->shouldApply(Status::VERIF_MENUNGGU, Status::VERIF_MENUNGGU)); // pending ulang
    }

    public function testShouldApplyToleratesLegacyCapitalisation(): void
    {
        // Data lama bisa berisi "Menunggu" kapital — guard harus tetap benar.
        $svc = $this->service();
        $this->assertTrue($svc->shouldApply('Menunggu', Status::VERIF_VALID));
        $this->assertFalse($svc->shouldApply('Valid', Status::VERIF_MENUNGGU));
    }

    // ---------- order id ----------

    public function testBuildOrderIdFormat(): void
    {
        $orderId = $this->service()->buildOrderId(42, 1750000000);
        $this->assertSame('MG-42-1750000000', $orderId);
        $this->assertMatchesRegularExpression('/^MG-\d+-\d+$/', $orderId);
    }
}
