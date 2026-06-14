<?php

namespace App\Libraries;

use CodeIgniter\Email\Email;
use Config\Services;
use Throwable;

/**
 * Wrapper untuk CI4 Email service.
 *
 * Tanggung jawab:
 *  - Render template HTML branded (gelap + teal) + alternatif plain-text.
 *  - try/catch — tidak pernah melempar error ke flow user.
 *  - return bool (true = terkirim, false = ada masalah). Kegagalan dicatat
 *    di log.
 *  - Mendukung file attachment (untuk invoice PDF).
 *
 * Lihat DECISIONS.md §6.
 */
final class Mailer
{
    public function __construct(private ?Email $email = null)
    {
        $this->email ??= Services::email();
    }

    /**
     * Kirim email. Parameter:
     *   $to        - alamat tujuan
     *   $subject   - subjek
     *   $viewName  - nama view di app/Views/emails/<nama>.php
     *   $data      - data untuk view
     *   $plainText - alternatif plain text (opsional)
     *   $attachPath - path file lampiran (opsional)
     *   $attachName - nama file lampiran (opsional)
     */
    public function send(
        string $to,
        string $subject,
        string $viewName,
        array $data = [],
        ?string $plainText = null,
        ?string $attachPath = null,
        ?string $attachName = null
    ): bool {
        try {
            $html = view('emails/_layout', array_merge($data, [
                'subject' => $subject,
                'body'    => view('emails/' . $viewName, $data),
            ]));

            $this->email->clear(true);
            $this->email->setFrom(
                env('email.fromEmail', 'no-reply@mellogang.test'),
                env('email.fromName', 'MellogangVisuals')
            );
            $this->email->setTo($to);
            $this->email->setSubject($subject);
            $this->email->setMessage($html);
            $this->email->setMailType('html');

            if ($plainText !== null) {
                $this->email->setAltMessage($plainText);
            }

            if ($attachPath !== null && is_file($attachPath)) {
                $this->email->attach($attachPath, '', 'attachment', $attachName ?: basename($attachPath));
            }

            return (bool) $this->email->send(false);
        } catch (Throwable $e) {
            log_message('error', '[Mailer] ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Quick helper untuk flash warning ke UI.
     */
    public function flashFailure(string $message = 'Gagal mengirim email. Coba lagi nanti.'): void
    {
        session()->setFlashdata('warning', $message);
    }
}
