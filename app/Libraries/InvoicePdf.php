<?php

namespace App\Libraries;

use Dompdf\Dompdf;
use Dompdf\Options;

/**
 * Generate PDF invoice untuk sebuah order.
 *
 * Lihat DECISIONS.md §6.3 (Invoice).
 */
final class InvoicePdf
{
    public function render(array $order, array $validPays, int $totalOrder, int $totalValid, int $sisa, string $invoiceNo): string
    {
        $rupiah = static fn(int $n) => 'Rp ' . number_format($n, 0, ',', '.');

        $html = view('public/invoice/pdf', [
            'order'      => $order,
            'validPays'  => $validPays,
            'totalOrder' => $totalOrder,
            'totalValid' => $totalValid,
            'sisa'       => $sisa,
            'invoiceNo'  => $invoiceNo,
            'rupiah'     => $rupiah,
            'issuedAt'   => date('Y-m-d H:i'),
        ]);

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', false);
        $options->set('defaultFont', 'Helvetica');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        return $dompdf->output();
    }

    public function saveToTemp(string $pdfContent, string $filename): string
    {
        $dir = WRITEPATH . 'invoice-tmp/';
        if (! is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }
        $path = $dir . $filename;
        file_put_contents($path, $pdfContent);
        return $path;
    }
}
