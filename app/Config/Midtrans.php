<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Konfigurasi Midtrans Snap.
 * Nilai diambil dari .env: midtrans.serverKey, midtrans.clientKey,
 * midtrans.isProduction, midtrans.merchantId (BaseConfig otomatis
 * menimpa properti dari prefix "midtrans.").
 */
class Midtrans extends BaseConfig
{
    public string $serverKey = '';

    public string $clientKey = '';

    public bool $isProduction = false;

    public string $merchantId = '';

    /**
     * Metode pembayaran yang diaktifkan di Snap popup.
     *
     * @var list<string>
     */
    public array $enabledPayments = ['qris', 'gopay', 'shopeepay', 'bank_transfer'];

    public function snapJsUrl(): string
    {
        return $this->isProduction
            ? 'https://app.midtrans.com/snap/snap.js'
            : 'https://app.sandbox.midtrans.com/snap/snap.js';
    }
}
