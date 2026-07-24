<?php

namespace App\Controllers;

use App\Services\MidtransService;
use App\Services\PembayaranService;
use App\Support\Status;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Webhook Midtrans (Payment Notification URL).
 * POST /payment/midtrans/notify — dikecualikan dari CSRF (lihat Filters.php).
 *
 * Webhook = SATU-SATUNYA sumber kebenaran status pembayaran otomatis.
 * Callback Snap di browser tidak pernah mengubah state.
 */
class PaymentWebhookController extends BaseController
{
    public function notify(): ResponseInterface
    {
        $raw     = (string) $this->request->getBody();
        $payload = json_decode($raw, true);

        if (! is_array($payload)) {
            return $this->respondJson(400, ['ok' => false, 'error' => 'invalid_json']);
        }

        $midtrans = new MidtransService();
        $orderId  = (string) ($payload['order_id'] ?? '');
        $sigValid = $midtrans->verifySignature($payload);
        $db       = db_connect();

        // Audit log SEMUA payload, termasuk yang signature-nya invalid.
        $db->table('payment_notification')->insert([
            'midtrans_order_id'  => $orderId !== '' ? $orderId : '(none)',
            'transaction_status' => (string) ($payload['transaction_status'] ?? ''),
            'status_code'        => (string) ($payload['status_code'] ?? ''),
            'signature_valid'    => $sigValid ? 1 : 0,
            'raw_payload'        => $raw,
            'created_at'         => date('Y-m-d H:i:s'),
        ]);

        if (! $sigValid) {
            log_message('warning', 'Midtrans notify: signature INVALID untuk order_id {order}', ['order' => $orderId]);

            return $this->respondJson(403, ['ok' => false, 'error' => 'invalid_signature']);
        }

        $row = $db->table('pembayaran')
            ->where('midtrans_order_id', $orderId)
            ->get()->getRowArray();

        if (! $row) {
            // Bukan transaksi kita (mis. test dari dashboard) — 200 supaya
            // Midtrans tidak retry terus.
            return $this->respondJson(200, ['ok' => true, 'note' => 'unknown_order_id']);
        }

        $txStatus  = (string) ($payload['transaction_status'] ?? '');
        $newVerif  = $midtrans->mapStatus($txStatus, $payload['fraud_status'] ?? null);
        $curVerif  = strtolower(trim((string) ($row['status_verifikasi'] ?? '')));

        // Idempotency: hanya upgrade (menunggu -> ditolak -> valid); payload
        // sama / lebih rendah diabaikan (tetap 200).
        if (! $midtrans->shouldApply($curVerif, $newVerif)) {
            return $this->respondJson(200, ['ok' => true, 'note' => 'no_state_change']);
        }

        // Sanity check nominal: gross_amount harus cocok dengan tagihan row.
        $gross = (int) round((float) ($payload['gross_amount'] ?? 0));
        if ($gross > 0 && (int) $row['jumlah_bayar'] > 0 && $gross !== (int) $row['jumlah_bayar']) {
            log_message('error', 'Midtrans notify: gross_amount {g} != jumlah_bayar {j} (order {o})', [
                'g' => $gross, 'j' => $row['jumlah_bayar'], 'o' => $orderId,
            ]);

            return $this->respondJson(200, ['ok' => true, 'note' => 'amount_mismatch_ignored']);
        }

        $update = [
            'payment_type'       => (string) ($payload['payment_type'] ?? ''),
            'transaction_status' => $txStatus,
            'status_verifikasi'  => $newVerif,
            'gross_amount'       => $gross > 0 ? $gross : null,
        ];

        if ($newVerif === Status::VERIF_VALID) {
            $update['paid_at']       = (string) ($payload['settlement_time'] ?? date('Y-m-d H:i:s'));
            $update['tanggal_bayar'] = $update['paid_at'];
            $update['catatan_verifikasi'] = 'Otomatis via Midtrans (' . ($payload['payment_type'] ?? '-') . ')';
        } elseif ($newVerif === Status::VERIF_DITOLAK) {
            $update['catatan_verifikasi'] = 'Midtrans: ' . $txStatus;
        }

        $db->table('pembayaran')->where('id_pembayaran', (int) $row['id_pembayaran'])->update($update);

        // Update status pesanan lewat domain logic bersama.
        (new PembayaranService())->recalcOrderStatus((int) $row['id_pemesanan']);

        return $this->respondJson(200, ['ok' => true]);
    }

    private function respondJson(int $code, array $body): ResponseInterface
    {
        return $this->response->setStatusCode($code)->setJSON($body);
    }
}
