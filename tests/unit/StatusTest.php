<?php

namespace Tests\unit;

use App\Support\Status;
use CodeIgniter\Test\CIUnitTestCase;

/**
 * @internal
 */
final class StatusTest extends CIUnitTestCase
{
    public function testProdTransitionsValid(): void
    {
        $this->assertTrue(Status::canProdTransition(Status::PROD_CUT_TO_CUT, Status::PROD_FINISHING));
        $this->assertTrue(Status::canProdTransition(Status::PROD_FINISHING, Status::PROD_DONE));
        $this->assertTrue(Status::canProdTransition(Status::PROD_REVISI, Status::PROD_REVISI_SELESAI));
        $this->assertTrue(Status::canProdTransition(Status::PROD_REVISI_SELESAI, Status::PROD_DONE));
        $this->assertTrue(Status::canProdTransition(Status::PROD_PRA_PRODUKSI, Status::PROD_SHOOTING));
    }

    public function testProdTransitionsInvalid(): void
    {
        $this->assertFalse(Status::canProdTransition(Status::PROD_PRA_PRODUKSI, Status::PROD_DONE));
        $this->assertFalse(Status::canProdTransition(Status::PROD_DONE, Status::PROD_FINISHING));
        $this->assertFalse(Status::canProdTransition(Status::PROD_SHOOTING, Status::PROD_FINISHING));
    }

    public function testOrderLabel(): void
    {
        $this->assertSame('Lunas', Status::orderLabel(Status::ORDER_LUNAS));
        $this->assertSame('Serah Terima Hasil', Status::orderLabel(Status::ORDER_SERAH_TERIMA_HASIL));
        $this->assertSame('Menunggu Pembayaran', Status::orderLabel(Status::ORDER_MENUNGGU_PEMBAYARAN));
    }

    public function testProdLabel(): void
    {
        $this->assertSame('Pra Produksi', Status::prodLabel(Status::PROD_PRA_PRODUKSI));
        $this->assertSame('Cut to Cut', Status::prodLabel(Status::PROD_CUT_TO_CUT));
        $this->assertSame('Revisi Selesai', Status::prodLabel(Status::PROD_REVISI_SELESAI));
    }

    public function testOrderColor(): void
    {
        $this->assertSame('ok', Status::orderColor(Status::ORDER_LUNAS));
        $this->assertSame('danger', Status::orderColor(Status::ORDER_BATAL));
        $this->assertSame('warn', Status::orderColor(Status::ORDER_MENUNGGU_PEMBAYARAN));
    }

    public function testProdFinal(): void
    {
        $this->assertContains(Status::PROD_DONE, Status::PROD_FINAL);
        $this->assertContains(Status::PROD_REVISI_SELESAI, Status::PROD_FINAL);
    }
}
