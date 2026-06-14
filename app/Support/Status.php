<?php

namespace App\Support;

/**
 * Status kanonik + label Indonesia.
 *
 * Pakai konstanta ini (bukan string literal) di seluruh aplikasi.
 * Lihat DECISIONS.md §4 untuk konteks.
 */
final class Status
{
    // ===== status_pemesanan =====
    public const ORDER_MENUNGGU_PEMBAYARAN  = 'menunggu_pembayaran';
    public const ORDER_MENUNGGU_PELUNASAN   = 'menunggu_pelunasan';
    public const ORDER_MENUNGGU_VERIFIKASI  = 'menunggu_verifikasi';
    public const ORDER_LUNAS                = 'lunas';
    public const ORDER_REVISI_PELANGGAN     = 'revisi_pelanggan';
    public const ORDER_REVISI_DIPROSES      = 'revisi_diproses';
    public const ORDER_SERAH_TERIMA_HASIL   = 'serah_terima_hasil';
    public const ORDER_SELESAI              = 'selesai';
    public const ORDER_BATAL                = 'batal';
    public const ORDER_DITOLAK              = 'ditolak';

    // ===== status_produksi =====
    public const PROD_PRA_PRODUKSI   = 'pra_produksi';
    public const PROD_SHOOTING       = 'shooting';
    public const PROD_CUT_TO_CUT     = 'cut_to_cut';
    public const PROD_FINISHING      = 'finishing';
    public const PROD_DONE           = 'done';
    public const PROD_REVISI         = 'revisi';
    public const PROD_REVISI_SELESAI = 'revisi_selesai';

    // ===== status_verifikasi =====
    public const VERIF_MENUNGGU = 'menunggu';
    public const VERIF_VALID    = 'valid';
    public const VERIF_DITOLAK  = 'ditolak';

    /**
     * Label Indonesia untuk status_pemesanan.
     * Dipakai di view (badge, tabel, dll).
     */
    public static function orderLabel(string $value): string
    {
        return match ($value) {
            self::ORDER_MENUNGGU_PEMBAYARAN => 'Menunggu Pembayaran',
            self::ORDER_MENUNGGU_PELUNASAN  => 'Menunggu Pelunasan',
            self::ORDER_MENUNGGU_VERIFIKASI => 'Menunggu Verifikasi',
            self::ORDER_LUNAS               => 'Lunas',
            self::ORDER_REVISI_PELANGGAN    => 'Revisi Pelanggan',
            self::ORDER_REVISI_DIPROSES     => 'Revisi Diproses',
            self::ORDER_SERAH_TERIMA_HASIL  => 'Serah Terima Hasil',
            self::ORDER_SELESAI             => 'Selesai',
            self::ORDER_BATAL               => 'Batal',
            self::ORDER_DITOLAK             => 'Ditolak',
            default                         => ucwords(str_replace('_', ' ', $value)),
        };
    }

    public static function prodLabel(string $value): string
    {
        return match ($value) {
            self::PROD_PRA_PRODUKSI   => 'Pra Produksi',
            self::PROD_SHOOTING       => 'Shooting',
            self::PROD_CUT_TO_CUT     => 'Cut to Cut',
            self::PROD_FINISHING      => 'Finishing',
            self::PROD_DONE           => 'Done',
            self::PROD_REVISI         => 'Revisi',
            self::PROD_REVISI_SELESAI => 'Revisi Selesai',
            default                   => ucwords(str_replace('_', ' ', $value)),
        };
    }

    public static function verifLabel(string $value): string
    {
        return match ($value) {
            self::VERIF_MENUNGGU => 'Menunggu',
            self::VERIF_VALID    => 'Valid',
            self::VERIF_DITOLAK  => 'Ditolak',
            default              => ucwords($value),
        };
    }

    /**
     * Warna pill (CSS class suffix) untuk badge status_pemesanan.
     */
    public static function orderColor(string $value): string
    {
        return match ($value) {
            self::ORDER_MENUNGGU_PEMBAYARAN,
            self::ORDER_MENUNGGU_PELUNASAN,
            self::ORDER_MENUNGGU_VERIFIKASI => 'warn',
            self::ORDER_LUNAS               => 'ok',
            self::ORDER_REVISI_PELANGGAN,
            self::ORDER_REVISI_DIPROSES     => 'warn',
            self::ORDER_SERAH_TERIMA_HASIL,
            self::ORDER_SELESAI             => 'ok',
            self::ORDER_BATAL,
            self::ORDER_DITOLAK             => 'danger',
            default                         => 'muted',
        };
    }

    public static function prodColor(string $value): string
    {
        return match ($value) {
            self::PROD_PRA_PRODUKSI   => 'muted',
            self::PROD_SHOOTING       => 'brand',
            self::PROD_CUT_TO_CUT     => 'brand',
            self::PROD_FINISHING      => 'brand',
            self::PROD_DONE           => 'ok',
            self::PROD_REVISI         => 'warn',
            self::PROD_REVISI_SELESAI => 'ok',
            default                   => 'muted',
        };
    }

    public static function verifColor(string $value): string
    {
        return match ($value) {
            self::VERIF_MENUNGGU => 'warn',
            self::VERIF_VALID    => 'ok',
            self::VERIF_DITOLAK  => 'danger',
            default              => 'muted',
        };
    }

    /**
     * Daftar semua status_pemesanan yang dianggap "aktif" untuk
     * perhitungan availability (lihat juga migration normalisasi
     * & query controller). Batal & ditolak dikecualikan.
     */
    public const ORDER_ACTIVE = [
        self::ORDER_MENUNGGU_PEMBAYARAN,
        self::ORDER_MENUNGGU_PELUNASAN,
        self::ORDER_MENUNGGU_VERIFIKASI,
        self::ORDER_LUNAS,
        self::ORDER_REVISI_PELANGGAN,
        self::ORDER_REVISI_DIPROSES,
        self::ORDER_SERAH_TERIMA_HASIL,
        self::ORDER_SELESAI,
    ];

    /**
     * Status yang menandakan order "habis"/tidak aktif.
     */
    public const ORDER_INACTIVE = [
        self::ORDER_BATAL,
        self::ORDER_DITOLAK,
    ];

    /**
     * Mapping transisi status_produksi yang valid (state machine).
     * Key = current, value = [list next states].
     *
     *   pra_produksi -> shooting -> cut_to_cut -> finishing -> done
     *                                                       |
     *                                                       v
     *                                                  revisi -> revisi_selesai
     */
    public static function prodTransitions(): array
    {
        return [
            self::PROD_PRA_PRODUKSI   => [self::PROD_SHOOTING, self::PROD_CUT_TO_CUT],
            self::PROD_SHOOTING       => [self::PROD_CUT_TO_CUT],
            self::PROD_CUT_TO_CUT     => [self::PROD_FINISHING],
            self::PROD_FINISHING      => [self::PROD_DONE],
            self::PROD_DONE           => [self::PROD_REVISI],
            self::PROD_REVISI         => [self::PROD_REVISI_SELESAI],
            self::PROD_REVISI_SELESAI => [self::PROD_DONE],
        ];
    }

    /**
     * Apakah $next adalah transisi valid dari $current?
     */
    public static function canProdTransition(string $current, string $next): bool
    {
        $allowed = self::prodTransitions()[$current] ?? [];
        return in_array($next, $allowed, true);
    }

    /**
     * Daftar status_produksi yang menandakan "editing selesai"
     * (yaitu layak untuk dikonfirmasi pelanggan).
     */
    public const PROD_FINAL = [
        self::PROD_DONE,
        self::PROD_REVISI_SELESAI,
    ];
}
