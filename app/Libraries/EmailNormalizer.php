<?php

namespace App\Libraries;

/**
 * Normalisasi alamat email untuk dedup & lookup.
 *
 * Aturan (lihat DECISIONS.md §5.1):
 *   1. trim + strtolower
 *   2. pisah di '@' terakhir
 *   3. googlemail.com -> gmail.com
 *   4. Untuk gmail.com: hapus semua '.' di local, potong di '+' pertama
 *   5. Untuk domain lain: potong di '+' pertama; titik tetap
 *
 * Contoh hasil:
 *   "Tes.S+spam@Gmail.com"        -> "tes@gmail.com"
 *   "foo.bar+alias@googlemail.com" -> "foobar@gmail.com"
 *   "john.doe+work@example.com"    -> "john.doe@example.com"
 */
final class EmailNormalizer
{
    /**
     * Kembalikan canonical form dari email.
     */
    public static function canonical(string $email): string
    {
        $e = strtolower(trim($email));
        if ($e === '') {
            return '';
        }

        $at = strrpos($e, '@');
        if ($at === false) {
            return $e; // bukan email valid, kembalikan apa adanya
        }

        $local  = substr($e, 0, $at);
        $domain = substr($e, $at + 1);

        if ($domain === 'googlemail.com') {
            $domain = 'gmail.com';
        }

        if ($domain === 'gmail.com') {
            // hapus SEMUA titik
            $local = str_replace('.', '', $local);
        }

        // potong di '+' pertama (semua domain)
        $plus = strpos($local, '+');
        if ($plus !== false) {
            $local = substr($local, 0, $plus);
        }

        return $local . '@' . $domain;
    }

    /**
     * Validasi format email dasar (setelah normalisasi).
     */
    public static function isValid(string $email): bool
    {
        return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
    }
}
