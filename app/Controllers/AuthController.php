<?php

namespace App\Controllers;

use App\Libraries\EmailNormalizer;
use App\Libraries\GoogleAuth;
use App\Libraries\Mailer;
use App\Models\AuthTokenModel;
use App\Models\UserModel;
use App\Support\Status;
use CodeIgniter\HTTP\RedirectResponse;
use Throwable;

class AuthController extends BaseController
{
    private UserModel $users;
    private AuthTokenModel $tokens;
    private Mailer $mailer;
    private ?GoogleAuth $google = null;

    public function __construct()
    {
        $this->users  = new UserModel();
        $this->tokens = new AuthTokenModel();
        $this->mailer = new Mailer();
        try {
            $this->google = new GoogleAuth();
        } catch (Throwable $e) {
            $this->google = null;
        }
    }

    private function redirectByRole(string $role): string
    {
        return match ($role) {
            'admin'  => '/admin',
            'editor' => '/editor',
            default  => '/pelanggan',
        };
    }

    // ===================================================================
    // LOGIN
    // ===================================================================

    public function loginForm()
    {
        helper(['form', 'url']);
        // Google selalu ditampilkan (kalau belum dikonfigurasi, klik tombol
        // akan redirect dengan pesan "belum dikonfigurasi").
        $googleOn = $this->google?->isConfigured() ?? false;
        return view('auth/login', [
            'title'      => 'Login',
            'validation' => service('validation'),
            'googleOn'   => $googleOn,
        ]);
    }

    public function login()
    {
        helper(['form', 'url']);

        // Throttle by IP — 5 attempt / 10 menit
        $throttler = service('throttler');
        $ipKey = 'login_' . md5((string) $this->request->getIPAddress());
        if ($throttler->check($ipKey, 5, 600) === false) {
            return $this->throttleBack('login');
        }

        $rules = [
            'email'    => 'required|valid_email|max_length[190]',
            'password' => 'required',
        ];
        if (! $this->validate($rules)) {
            return view('auth/login', [
                'title'      => 'Login',
                'validation' => $this->validator,
                'googleOn'   => $this->google?->isConfigured() ?? false,
            ]);
        }

        $emailRaw   = (string) $this->request->getPost('email');
        $emailCanon = EmailNormalizer::canonical($emailRaw);
        $pass       = (string) $this->request->getPost('password');

        $user = $this->users->findByEmailAny($emailCanon, $emailRaw);
        if (! $user) {
            return redirect()->back()->withInput()->with('error', 'Email atau kata sandi salah.');
        }

        if ($this->users->isLocked($user)) {
            return redirect()->back()->withInput()->with(
                'error',
                'Akun dikunci sementara karena 4x salah sandi. Kami kirim link pembuka ke emailmu — cek juga folder Spam/Promosi.'
            );
        }

        if (! password_verify($pass, (string) $user['password'])) {
            $attempts = $this->users->registerFailedLogin((int) $user['id_user']);
            if ($attempts >= 4) {
                $this->users->lockAccount((int) $user['id_user'], 30);
                $this->sendUnlockLink($user);
                return redirect()->back()->withInput()->with(
                    'error',
                    'Akun dikunci sementara karena 4x salah sandi. Kami kirim link pembuka ke emailmu — cek juga folder Spam/Promosi.'
                );
            }
            return redirect()->back()->withInput()->with(
                'error',
                "Email atau kata sandi salah. Sisa percobaan: " . max(0, 4 - $attempts) . "x."
            );
        }

        // Cek verifikasi email (kecuali untuk user yang dibuat via seeder
        // — kita sudah backfill email_verified_at di migration).
        $verified = ! empty($user['email_verified_at']);
        if (! $verified) {
            // Kirim ulang OTP supaya user bisa verifikasi & lanjut login.
            $this->issueOtp((int) $user['id_user']);
            return redirect()->to(site_url('auth/verify?email=' . urlencode($user['email'])))
                ->with('warning', 'Akun kamu belum verifikasi email. Kode OTP baru sudah dikirim.');
        }

        $this->loginSuccess($user);
        return redirect()->to($this->redirectByRole((string) $user['role']));
    }

    /**
     * Aksi setelah password verified & email verified.
     */
    private function loginSuccess(array $user): void
    {
        $this->users->clearFailedLogin((int) $user['id_user']);
        session()->regenerate();
        session()->set([
            'logged_in'    => true,
            'id_user'      => $user['id_user'],
            'nama_lengkap' => $user['nama_lengkap'],
            'email'        => $user['email'],
            'role'         => $user['role'],
        ]);
        if ($user['role'] === 'editor') {
            session()->set('show_tugas_popup', true);
        }
    }

    // ===================================================================
    // REGISTER + VERIFIKASI OTP
    // ===================================================================

    public function registerForm()
    {
        helper(['form', 'url']);
        return view('auth/register', [
            'title'      => 'Daftar Akun',
            'validation' => service('validation'),
            'googleOn'   => $this->google?->isConfigured() ?? false,
        ]);
    }

    public function register()
    {
        helper(['form', 'url']);

        $throttler = service('throttler');
        $ipKey = 'register_' . md5((string) $this->request->getIPAddress());
        if ($throttler->check($ipKey, 5, 600) === false) {
            return $this->throttleBack('register');
        }

        $rules = [
            'nama_lengkap'     => 'required|min_length[3]|max_length[100]',
            'email'            => 'required|valid_email|max_length[190]',
            'no_telepon'       => 'required|min_length[8]|max_length[20]',
            'password'         => 'required|min_length[8]|max_length[255]',
            'password_confirm' => 'required|matches[password]',
        ];
        if (! $this->validate($rules)) {
            return view('auth/register', [
                'title'      => 'Daftar Akun',
                'validation' => $this->validator,
                'googleOn'   => $this->google?->isConfigured() ?? false,
            ]);
        }

        $emailRaw   = (string) $this->request->getPost('email');
        $emailCanon = EmailNormalizer::canonical($emailRaw);

        // Cek duplikat via email_canonical (anti dot-trick)
        $existing = $this->users->findByEmailAny($emailCanon, $emailRaw);
        if ($existing) {
            return redirect()->back()->withInput()->with('error', 'Email ini sudah terdaftar. Silakan login.');
        }

        $passOk = $this->isPasswordStrong((string) $this->request->getPost('password'));
        if ($passOk !== true) {
            return redirect()->back()->withInput()->with('error', 'Sandi minimal 8 karakter dan harus mengandung huruf + angka.');
        }

        $idUser = $this->users->insert([
            'nama_lengkap'   => $this->request->getPost('nama_lengkap'),
            'email'          => $emailRaw,
            'email_canonical'=> $emailCanon,
            'no_telepon'     => $this->request->getPost('no_telepon'),
            'password'       => password_hash((string) $this->request->getPost('password'), PASSWORD_DEFAULT),
            'role'           => 'pelanggan',
            'auth_provider'  => 'password',
        ], true);

        $this->issueOtp((int) $idUser);

        return redirect()->to(site_url('auth/verify?email=' . urlencode($emailRaw)))
            ->with('success', 'Registrasi berhasil. Masukkan kode OTP yang dikirim ke email kamu. Cek folder Spam/Promosi kalau tidak masuk.');
    }

    public function verifyForm()
    {
        helper(['form', 'url']);
        return view('auth/verify', [
            'title'      => 'Verifikasi Akun',
            'validation' => service('validation'),
            'email'      => (string) $this->request->getGet('email'),
        ]);
    }

    public function verify()
    {
        helper(['form', 'url']);

        $emailRaw = (string) $this->request->getPost('email');
        $otp      = trim((string) $this->request->getPost('otp'));
        $token    = trim((string) $this->request->getPost('token'));

        $user = $this->users->findByEmailAny(EmailNormalizer::canonical($emailRaw), $emailRaw);
        if (! $user) {
            return redirect()->to(site_url('register'))->with('error', 'Akun tidak ditemukan.');
        }

        $found = null;
        if ($otp !== '') {
            $found = $this->tokens->findValid(AuthTokenModel::TYPE_VERIFY_EMAIL, null, $otp, (int) $user['id_user']);
        } elseif ($token !== '') {
            $found = $this->tokens->findValid(AuthTokenModel::TYPE_VERIFY_EMAIL, $token, null, (int) $user['id_user']);
        }

        if (! $found) {
            return redirect()->back()->with('error', 'Kode OTP / link tidak valid atau sudah kadaluarsa.');
        }

        $this->tokens->markUsed((int) $found['id']);
        $this->users->update((int) $user['id_user'], ['email_verified_at' => date('Y-m-d H:i:s')]);
        $user['email_verified_at'] = date('Y-m-d H:i:s');

        $this->loginSuccess($user);
        return redirect()->to($this->redirectByRole((string) $user['role']))
            ->with('success', 'Verifikasi berhasil. Selamat datang!');
    }

    public function resendOtp()
    {
        helper(['form', 'url']);

        $throttler = service('throttler');
        $ipKey = 'resendotp_' . md5((string) $this->request->getIPAddress());
        if ($throttler->check($ipKey, 3, 600) === false) {
            return $this->throttleBack('verify');
        }

        $emailRaw = (string) $this->request->getPost('email');
        $user = $this->users->findByEmailAny(EmailNormalizer::canonical($emailRaw), $emailRaw);
        if (! $user) {
            return redirect()->back()->with('error', 'Akun tidak ditemukan.');
        }
        $this->issueOtp((int) $user['id_user']);
        return redirect()->to(site_url('auth/verify?email=' . urlencode($emailRaw)))
            ->with('success', 'Kode OTP baru sudah dikirim.');
    }

    private function issueOtp(int $idUser): void
    {
        $otp   = AuthTokenModel::generateOtp();
        $token = $this->tokens->issue($idUser, AuthTokenModel::TYPE_VERIFY_EMAIL, 900, $otp);
        $user  = $this->users->find($idUser);

        if ($user && ! empty($user['email'])) {
            $this->mailer->send(
                (string) $user['email'],
                'Verifikasi Akun MellogangVisuals',
                'verify_otp',
                [
                    'nama'       => $user['nama_lengkap'] ?? '',
                    'otp'        => $otp,
                    'verifyUrl'  => site_url('auth/verify-link?token=' . urlencode($token['token']) . '&email=' . urlencode((string) $user['email'])),
                ]
            );
        }
    }

    /**
     * Route untuk klik link dari email — verifikasi otomatis.
     */
    public function verifyLink()
    {
        helper(['form', 'url']);
        $email = (string) $this->request->getGet('email');
        $token = (string) $this->request->getGet('token');
        $user = $this->users->findByEmailAny(EmailNormalizer::canonical($email), $email);
        if (! $user) {
            return redirect()->to(site_url('register'))->with('error', 'Akun tidak ditemukan.');
        }
        $found = $this->tokens->findValid(AuthTokenModel::TYPE_VERIFY_EMAIL, $token, null, (int) $user['id_user']);
        if (! $found) {
            return redirect()->to(site_url('auth/verify?email=' . urlencode($email)))
                ->with('error', 'Link verifikasi tidak valid atau sudah kadaluarsa.');
        }
        $this->tokens->markUsed((int) $found['id']);
        $this->users->update((int) $user['id_user'], ['email_verified_at' => date('Y-m-d H:i:s')]);
        $user['email_verified_at'] = date('Y-m-d H:i:s');
        $this->loginSuccess($user);
        return redirect()->to($this->redirectByRole((string) $user['role']))
            ->with('success', 'Verifikasi berhasil. Selamat datang!');
    }

    // ===================================================================
    // GOOGLE OAUTH
    // ===================================================================

    public function googleRedirect()
    {
        if (! $this->google) {
            return redirect()->to(site_url('login'))->with('error', 'Login Google belum dikonfigurasi. Isi GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET di .env.');
        }
        if (! $this->google->isConfigured()) {
            return redirect()->to(site_url('login'))->with('error', 'Login Google belum dikonfigurasi. Isi GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET di .env.');
        }
        $state = $this->google->getState();
        session()->set('oauth_state', $state);
        return redirect()->to($this->google->getAuthorizationUrl());
    }

    public function googleCallback()
    {
        if (! $this->google || ! $this->google->isConfigured()) {
            return redirect()->to(site_url('login'))->with('error', 'Login Google belum dikonfigurasi.');
        }
        $state = (string) $this->request->getGet('state');
        $saved = (string) session()->get('oauth_state');
        if ($state === '' || $state !== $saved) {
            return redirect()->to(site_url('login'))->with('error', 'Sesi OAuth tidak valid. Coba lagi.');
        }
        session()->remove('oauth_state');

        $code = (string) $this->request->getGet('code');
        if ($code === '') {
            return redirect()->to(site_url('login'))->with('error', 'Login Google dibatalkan.');
        }

        $payload = $this->google->fetchUser($code);
        if (! $payload || empty($payload['email']) || empty($payload['sub'])) {
            return redirect()->to(site_url('login'))->with('error', 'Gagal membaca data Google. Coba lagi.');
        }
        if (empty($payload['email_verified'])) {
            return redirect()->to(site_url('login'))
                ->with('error', 'Email Google kamu belum terverifikasi oleh Google. Verifikasi dulu di akun Google kamu.');
        }

        $emailRaw   = (string) $payload['email'];
        $emailCanon = EmailNormalizer::canonical($emailRaw);
        $googleId   = (string) $payload['sub'];
        $name       = (string) ($payload['name'] ?? 'Pengguna Google');
        $avatar     = (string) ($payload['picture'] ?? '');

        $user = $this->users->where('google_id', $googleId)->first();
        if (! $user) {
            $user = $this->users->findByEmailAny($emailCanon, $emailRaw);
        }
        if ($user) {
            $update = [];
            if (empty($user['google_id'])) {
                $update['google_id'] = $googleId;
            }
            if (empty($user['email_verified_at'])) {
                $update['email_verified_at'] = date('Y-m-d H:i:s');
            }
            if ($avatar !== '' && empty($user['avatar_url'])) {
                $update['avatar_url'] = $avatar;
            }
            if (! empty($update)) {
                $this->users->update((int) $user['id_user'], $update);
                $user = $this->users->find((int) $user['id_user']);
            }
        } else {
            $id = $this->users->insert([
                'nama_lengkap'    => $name,
                'email'           => $emailRaw,
                'email_canonical' => $emailCanon,
                'google_id'       => $googleId,
                'auth_provider'   => 'google',
                'avatar_url'      => $avatar,
                'email_verified_at' => date('Y-m-d H:i:s'),
                'no_telepon'      => '',
                'role'            => 'pelanggan',
            ], true);
            $user = $this->users->find((int) $id);
        }

        if (! $user) {
            return redirect()->to(site_url('login'))->with('error', 'Tidak bisa membuat akun Google.');
        }

        $this->loginSuccess($user);
        return redirect()->to($this->redirectByRole((string) $user['role']))
            ->with('success', 'Login Google berhasil.');
    }

    // ===================================================================
    // UNLOCK ACCOUNT
    // ===================================================================

    public function unlockForm()
    {
        return view('auth/unlock', [
            'title'      => 'Buka Kunci Akun',
            'validation' => service('validation'),
        ]);
    }

    public function unlock(string $token = '')
    {
        $token = $token !== '' ? $token : (string) $this->request->getGet('token');
        if ($token === '') {
            // Tanpa token: tampilkan halaman info unlock, bukan bounce ke login.
            return $this->unlockForm();
        }
        $found = $this->tokens->findValid(AuthTokenModel::TYPE_UNLOCK, $token);
        if (! $found) {
            return redirect()->to(site_url('login'))->with('error', 'Token unlock tidak valid atau sudah kadaluarsa.');
        }
        $this->tokens->markUsed((int) $found['id']);
        $this->users->update((int) $found['id_user'], [
            'failed_login_attempts' => 0,
            'locked_until'          => null,
        ]);
        return redirect()->to(site_url('login'))->with('success', 'Akun sudah dibuka. Silakan login.');
    }

    /**
     * Kirim email unlock link + catat token.
     */
    private function sendUnlockLink(array $user): void
    {
        if (empty($user['email'])) {
            return;
        }
        $token = $this->tokens->issue((int) $user['id_user'], AuthTokenModel::TYPE_UNLOCK, 1800);
        $this->mailer->send(
            (string) $user['email'],
            'Buka Kunci Akun MellogangVisuals',
            'unlock',
            [
                'nama'      => $user['nama_lengkap'] ?? '',
                'unlockUrl' => site_url('auth/unlock?token=' . urlencode($token['token'])),
            ]
        );
    }

    // ===================================================================
    // LOGOUT
    // ===================================================================

    public function logout()
    {
        session()->destroy();
        return redirect()->to(site_url('/'));
    }

    // ===================================================================
    // UTIL
    // ===================================================================

    private function throttleBack(string $view): RedirectResponse
    {
        return redirect()->to(site_url($view))
            ->with('error', 'Terlalu banyak percobaan. Coba lagi dalam beberapa menit.');
    }

    private function isPasswordStrong(string $pass): bool|string
    {
        if (strlen($pass) < 8) {
            return false;
        }
        if (! preg_match('/[A-Za-z]/', $pass)) {
            return false;
        }
        if (! preg_match('/[0-9]/', $pass)) {
            return false;
        }
        return true;
    }
}
