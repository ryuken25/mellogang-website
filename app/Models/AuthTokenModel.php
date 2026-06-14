<?php

namespace App\Models;

use CodeIgniter\Model;

class AuthTokenModel extends Model
{
    protected $table         = 'auth_token';
    protected $primaryKey    = 'id';
    protected $allowedFields = [
        'id_user', 'type', 'token_hash', 'otp_code',
        'expires_at', 'used_at', 'created_at',
    ];
    protected $useTimestamps = false; // kita handle created_at manual
    protected $returnType    = 'array';

    public const TYPE_VERIFY_EMAIL   = 'verify_email';
    public const TYPE_UNLOCK         = 'unlock';
    public const TYPE_PASSWORD_RESET = 'password_reset';

    /**
     * Generate OTP 6 digit.
     */
    public static function generateOtp(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Generate token acak (URL-safe).
     */
    public static function generateToken(int $bytes = 32): string
    {
        return rtrim(strtr(base64_encode(random_bytes($bytes)), '+/', '-_'), '=');
    }

    /**
     * Simpan token baru untuk user.
     *
     * @param string $type  self::TYPE_*
     * @param int    $ttlSeconds masa hidup dalam detik
     * @param string|null $otp OTP (untuk verify_email)
     * @return array{token:string,otp:?string} token & otp plain (akan di-hash di DB)
     */
    public function issue(int $idUser, string $type, int $ttlSeconds = 900, ?string $otp = null): array
    {
        $token = self::generateToken();
        $this->insert([
            'id_user'     => $idUser,
            'type'        => $type,
            'token_hash'  => hash('sha256', $token),
            'otp_code'    => $otp,
            'expires_at'  => date('Y-m-d H:i:s', time() + $ttlSeconds),
            'created_at'  => date('Y-m-d H:i:s'),
        ]);
        return ['token' => $token, 'otp' => $otp];
    }

    /**
     * Cari token valid (belum used, belum expire).
     */
    public function findValid(string $type, ?string $tokenPlain = null, ?string $otp = null, ?int $idUser = null): ?array
    {
        $b = $this->where('type', $type)
            ->where('used_at', null)
            ->where('expires_at >=', date('Y-m-d H:i:s'));

        if ($tokenPlain !== null) {
            $b->where('token_hash', hash('sha256', $tokenPlain));
        }
        if ($otp !== null) {
            $b->where('otp_code', $otp);
        }
        if ($idUser !== null) {
            $b->where('id_user', $idUser);
        }

        return $b->orderBy('id', 'DESC')->first();
    }

    /**
     * Tandai token sudah dipakai.
     */
    public function markUsed(int $id): void
    {
        $this->update($id, ['used_at' => date('Y-m-d H:i:s')]);
    }
}
