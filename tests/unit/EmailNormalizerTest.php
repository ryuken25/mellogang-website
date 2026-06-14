<?php

namespace Tests\unit;

use App\Libraries\EmailNormalizer;
use CodeIgniter\Test\CIUnitTestCase;

/**
 * @internal
 */
final class EmailNormalizerTest extends CIUnitTestCase
{
    public static function cases(): array
    {
        return [
            'simple lower'             => ['foo@example.com', 'foo@example.com'],
            'uppercase'                => ['FOO@EXAMPLE.COM', 'foo@example.com'],
            'trim'                     => ['  foo@example.com  ', 'foo@example.com'],
            'plus'                     => ['foo+alias@example.com', 'foo@example.com'],
            'plus non-gmail keeps dot' => ['john.doe+work@example.com', 'john.doe@example.com'],
            // Gmail: hapus SEMUA titik di local, lalu potong di '+'
            'gmail dot'                => ['tes.s@gmail.com', 'tess@gmail.com'],
            'gmail multi dot'          => ['a.b.c@gmail.com', 'abc@gmail.com'],
            // Gmail: 'Tes.S+spam@Gmail.com' -> lower 'tes.s+spam@gmail.com'
            //   -> gmail hapus titik: 'tess+spam@gmail.com'
            //   -> potong di '+': 'tess' -> 'tess@gmail.com'
            'gmail plus+dot'           => ['Tes.S+spam@Gmail.com', 'tess@gmail.com'],
            'gmail only plus'          => ['abc+xyz@gmail.com', 'abc@gmail.com'],
            'googlemail alias'         => ['foo.bar+alias@googlemail.com', 'foobar@gmail.com'],
            'googlemail'               => ['hello@googlemail.com', 'hello@gmail.com'],
        ];
    }

    /**
     * @dataProvider cases
     */
    public function testCanonical(string $input, string $expected): void
    {
        $this->assertSame($expected, EmailNormalizer::canonical($input));
    }

    public function testIsValid(): void
    {
        $this->assertTrue(EmailNormalizer::isValid('foo@example.com'));
        $this->assertFalse(EmailNormalizer::isValid('not-an-email'));
    }

    public function testDotTrickMapsToSameCanonical(): void
    {
        $a = EmailNormalizer::canonical('tes.s@gmail.com');
        $b = EmailNormalizer::canonical('tess@gmail.com');
        $c = EmailNormalizer::canonical('t.e.s.s@gmail.com');
        $d = EmailNormalizer::canonical('TESS+spam@Gmail.com');
        $this->assertSame($a, $b);
        $this->assertSame($a, $c);
        $this->assertSame($a, $d, 'semua varian dot-trick Gmail harus jadi canonical yang sama');
    }

    public function testPlusAliasMapsToSameCanonical(): void
    {
        $a = EmailNormalizer::canonical('john.doe+work@example.com');
        $b = EmailNormalizer::canonical('john.doe@example.com');
        $this->assertSame($a, $b, 'plus-alias harus dipetakan ke canonical yang sama');
    }
}
