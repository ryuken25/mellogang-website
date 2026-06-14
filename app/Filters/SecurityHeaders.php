<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

/**
 * Tambah security headers yang tidak disediakan CI4 SecureHeaders default.
 *
 *   - Content-Security-Policy (dengan allowance untuk YouTube img, IG CDN,
 *     Google avatars — lihat DECISIONS.md §10)
 *   - X-Frame-Options
 *   - X-Content-Type-Options
 *   - Referrer-Policy
 *
 * Dipasang sebagai "after" filter di Config\Filters.
 */
class SecurityHeaders implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        return null;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        $csp = "default-src 'self'; " .
               "img-src 'self' data: https://i.ytimg.com https://*.cdninstagram.com https://*.fbcdn.net https://*.ggpht.com https://lh3.googleusercontent.com https://*.googleusercontent.com; " .
               "media-src 'self' https://*.cdninstagram.com https://*.ggpht.com; " .
               "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; " .
               "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " .
               "font-src 'self' data: https://fonts.gstatic.com; " .
               "frame-src 'self' https://accounts.google.com https://drive.google.com https://docs.google.com https://www.youtube.com; " .
               "connect-src 'self' https://*.googleapis.com https://accounts.google.com; " .
               "form-action 'self'; " .
               "base-uri 'self';";

        $response->setHeader('Content-Security-Policy', $csp)
            ->setHeader('X-Frame-Options', 'SAMEORIGIN')
            ->setHeader('X-Content-Type-Options', 'nosniff')
            ->setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
            ->setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        return $response;
    }
}
