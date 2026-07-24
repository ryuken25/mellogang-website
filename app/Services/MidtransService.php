<?php

namespace App\Services;

use App\Support\Status;
use Config\Midtrans as MidtransConfig;
use Midtrans\Config as SdkConfig;
use Midtrans\Snap;

class MidtransService
{
    private MidtransConfig $config;

    public function __construct(?MidtransConfig $config = null)
    {
        $this->config = $config ?? config('Midtrans');
    }

    /**
     * Format order_id: MG-{id_pemesanan}-{timestamp}.
     */
    public function buildOrderId(int $idPemesanan, ?int $timestamp = null): string
    {
        return 'MG-' . $idPemesanan . '-' . ($timestamp ?? time());
    }

    /**
     * Buat transaksi Snap, kembalikan snap token.
     *
     * @param array $order    row pemesanan (kode_pemesanan, id_pemesanan, ...)
     * @param array $customer ['first_name' =>, 'email' =>, 'phone' =>]
     * @param array $items    item_details Midtrans (id, price, quantity, name)
     */
    public function createSnapTransaction(string $orderId, int $grossAmount, array $customer, array $items): string
    {
        $this->configureSdk();

        $params = [
            'transaction_details' => [
                'order_id'     => $orderId,
                'gross_amount' => $grossAmount, // integer rupiah, match BIGINT kolom uang
            ],
            'customer_details' => $customer,
            'item_details'     => $items,
            'enabled_payments' => $this->config->enabledPayments,
        ];

        return (string) Snap::getSnapToken($params);
    }

    /**
     * Verifikasi signature notifikasi:
     * sha512(order_id . status_code . gross_amount . serverKey) === signature_key
     */
    public function verifySignature(array $payload): bool
    {
        $orderId    = (string) ($payload['order_id'] ?? '');
        $statusCode = (string) ($payload['status_code'] ?? '');
        $gross      = (string) ($payload['gross_amount'] ?? '');
        $signature  = (string) ($payload['signature_key'] ?? '');

        if ($orderId === '' || $signature === '') {
            return false;
        }

        $expected = hash('sha512', $orderId . $statusCode . $gross . $this->config->serverKey);

        return hash_equals($expected, $signature);
    }

    /**
     * Map transaction_status Midtrans -> status_verifikasi kanonik.
     * settlement | capture(+fraud accept) -> valid
     * pending                             -> menunggu
     * deny | cancel | expire | failure    -> ditolak
     */
    public function mapStatus(string $transactionStatus, ?string $fraudStatus = null): string
    {
        $ts = strtolower(trim($transactionStatus));
        $fs = strtolower(trim((string) $fraudStatus));

        if ($ts === 'settlement') {
            return Status::VERIF_VALID;
        }
        if ($ts === 'capture') {
            return ($fs === '' || $fs === 'accept') ? Status::VERIF_VALID : Status::VERIF_MENUNGGU;
        }
        if ($ts === 'pending') {
            return Status::VERIF_MENUNGGU;
        }
        if (in_array($ts, ['deny', 'cancel', 'expire', 'failure'], true)) {
            return Status::VERIF_DITOLAK;
        }

        // Status tak dikenal: jangan ubah apa-apa yang final; anggap menunggu.
        return Status::VERIF_MENUNGGU;
    }

    /**
     * Precedence guard untuk idempotency webhook: notifikasi hanya boleh
     * meng-upgrade status, tidak pernah menurunkan / mengulang.
     * valid (2) > ditolak (1) > menunggu (0).
     *
     * @return bool true kalau status baru boleh diterapkan
     */
    public function shouldApply(?string $currentVerif, string $newVerif): bool
    {
        $rank = [
            Status::VERIF_MENUNGGU => 0,
            Status::VERIF_DITOLAK  => 1,
            Status::VERIF_VALID    => 2,
        ];

        $cur = $rank[strtolower(trim((string) $currentVerif))] ?? 0;
        $new = $rank[strtolower(trim($newVerif))] ?? 0;

        return $new > $cur;
    }

    public function clientKey(): string
    {
        return $this->config->clientKey;
    }

    public function snapJsUrl(): string
    {
        return $this->config->snapJsUrl();
    }

    private function configureSdk(): void
    {
        SdkConfig::$serverKey    = $this->config->serverKey;
        SdkConfig::$isProduction = $this->config->isProduction;
        SdkConfig::$isSanitized  = true;
        SdkConfig::$is3ds        = true;
    }
}
