<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table      = 'user';
    protected $primaryKey = 'id_user';

    protected $allowedFields = [
        'nama_lengkap',
        'email',
        'email_canonical',
        'email_verified_at',
        'google_id',
        'auth_provider',
        'avatar_url',
        'no_telepon',
        'password',
        'role',
        'failed_login_attempts',
        'locked_until',
        'last_login_at',
        'created_at',
        'updated_at',
    ];

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';

    protected $returnType = 'array';

    /**
     * Cari user by email_canonical (preferred) — kalau kolomnya
     * ada. Kalau belum ada migrasi, fallback ke email.
     */
    public function findByEmailAny(string $emailCanonical, string $emailRaw = ''): ?array
    {
        if ($this->db->fieldExists('email_canonical', 'user')) {
            $row = $this->where('email_canonical', $emailCanonical)->first();
            if ($row) {
                return $row;
            }
        }
        if ($emailRaw !== '') {
            $row = $this->where('email', $emailRaw)->first();
            if ($row) {
                return $row;
            }
        }
        return null;
    }

    public function isLocked(array $user): bool
    {
        if (empty($user['locked_until'])) {
            return false;
        }
        return strtotime((string) $user['locked_until']) > time();
    }

    public function registerFailedLogin(int $idUser): int
    {
        $this->set('failed_login_attempts', 'failed_login_attempts+1', false)
            ->where('id_user', $idUser)
            ->update();
        $row = $this->find($idUser);
        return (int) ($row['failed_login_attempts'] ?? 0);
    }

    public function clearFailedLogin(int $idUser): void
    {
        $this->update($idUser, [
            'failed_login_attempts' => 0,
            'locked_until'          => null,
            'last_login_at'         => date('Y-m-d H:i:s'),
        ]);
    }

    public function lockAccount(int $idUser, int $minutes = 30): void
    {
        $this->update($idUser, [
            'locked_until' => date('Y-m-d H:i:s', time() + $minutes * 60),
        ]);
    }
}
