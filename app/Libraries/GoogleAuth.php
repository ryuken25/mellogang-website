<?php

namespace App\Libraries;

use League\OAuth2\Client\Provider\Google;
use Throwable;

/**
 * Wrapper tipis untuk league/oauth2-google.
 *
 * Konfigurasi diambil dari .env:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REDIRECT_URI
 */
final class GoogleAuth
{
    private Google $provider;

    public function __construct()
    {
        $this->provider = new Google([
            'clientId'     => env('GOOGLE_CLIENT_ID', ''),
            'clientSecret' => env('GOOGLE_CLIENT_SECRET', ''),
            'redirectUri'  => env('GOOGLE_REDIRECT_URI', base_url('auth/google/callback')),
        ]);
    }

    /**
     * Bangun URL authorize. Pakai state CSRF.
     */
    public function getAuthorizationUrl(): string
    {
        return $this->provider->getAuthorizationUrl([
            'scope' => ['openid', 'email', 'profile'],
            'prompt' => 'select_account',
        ]);
    }

    public function getState(): string
    {
        return $this->provider->getState();
    }

    /**
     * Tukar code dengan access token + ambil data user.
     *
     * @return array{email:string,email_verified:bool,sub:string,name:string,picture?:string}|null
     */
    public function fetchUser(string $code): ?array
    {
        try {
            $token = $this->provider->getAccessToken('authorization_code', [
                'code' => $code,
            ]);
        } catch (Throwable $e) {
            log_message('error', '[GoogleAuth] token exchange failed: ' . $e->getMessage());
            return null;
        }

        try {
            $owner = $this->provider->getResourceOwner($token);
            return $owner->toArray();
        } catch (Throwable $e) {
            log_message('error', '[GoogleAuth] getResourceOwner failed: ' . $e->getMessage());
            return null;
        }
    }

    public function isConfigured(): bool
    {
        return env('GOOGLE_CLIENT_ID', '') !== '' && env('GOOGLE_CLIENT_SECRET', '') !== '';
    }
}
