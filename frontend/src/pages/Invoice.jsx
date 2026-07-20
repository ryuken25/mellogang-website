import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Download, Printer } from 'lucide-react'
import { Card, SectionHeader, StatusBadge } from '../components/ui'
import { brand } from '../data/brandData'
import { useAuth } from '../hooks/useAuth'
import { mockInvoices } from '../data/mockInvoices'
import { downloadInvoiceHtml, printInvoice } from '../lib/invoiceDownload'
import { rupiah } from '../lib/utils'

function InvoiceEmpty({ title, text }) {
  return (
    <section className="section-pad">
      <div className="container-premium max-w-4xl">
        <Card className="text-center">
          <img
            src={brand.logo}
            alt="Mellogang Visuals"
            className="mx-auto h-16 w-16 rounded-3xl object-cover"
          />
          <h1 className="mt-6 text-3xl font-semibold text-cream light:text-charcoal">{title}</h1>
          <p className="subtle mx-auto mt-3 max-w-xl">{text}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link className="btn-primary" to="/status">
              Lihat Status Pesanan
            </Link>
            <Link className="btn-secondary" to="/katalog">
              Booking Paket
            </Link>
            <a className="btn-secondary" href={brand.whatsapp} target="_blank" rel="noreferrer">
              <img src={brand.socialIcons.whatsapp} alt="WhatsApp" className="h-5 w-5" />
              Hubungi WhatsApp
            </a>
          </div>
        </Card>
      </div>
    </section>
  )
}

export default function Invoice() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const kodeFromUrl = params.kode || searchParams.get('kode') || ''
  const kode = kodeFromUrl.trim()
  const invoice =
    kode && user?.email
      ? mockInvoices.find(
          (item) =>
            (item.kode === kode || item.orderCode === kode) &&
            item.customerEmail === user.email
        )
      : null

  if (!kode) {
    return (
      <InvoiceEmpty
        title="Invoice tersedia setelah kamu membuat pesanan."
        text="Buka Status Pesanan untuk memilih order yang sudah memiliki invoice."
      />
    )
  }

  if (!invoice) {
    return (
      <InvoiceEmpty
        title="Invoice tidak ditemukan."
        text={`Tidak ada invoice yang cocok untuk kode ${kode || '-'}. Cek ulang kode pesanan atau hubungi Mellogang Visuals.`}
      />
    )
  }

  const rows = invoice.items || []

  function handleDownload() {
    // Prefer real file download (works on mobile / blocked print dialogs).
    // Print remains available as secondary "Save as PDF" path.
    const ok = downloadInvoiceHtml(invoice, user)
    if (!ok) printInvoice()
  }

  return (
    <section className="section-pad">
      <div className="container-premium max-w-6xl">
        <SectionHeader eyebrow="Invoice" title={`Invoice ${invoice?.kode || kode || '-'}`}>
          Login → Status Pesanan → Lihat Invoice.
        </SectionHeader>

        <div className="overflow-hidden rounded-[2.2rem] border border-gold/20 bg-[#07100e] text-cream shadow-soft light:bg-[#fffaf0] light:text-charcoal print:bg-white print:text-black">
          <div className="relative overflow-hidden p-6 sm:p-10">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />

            <div className="relative flex flex-col gap-6 border-b border-gold/20 pb-8 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={brand.logo}
                  alt="Mellogang Visuals"
                  className="h-16 w-16 rounded-3xl border border-gold/30 object-cover"
                />
                <div>
                  <p className="text-xs uppercase tracking-[.34em] text-gold">{brand.name}</p>
                  <h1 className="mt-2 text-4xl font-semibold">Premium Invoice</h1>
                  <p className="mt-1 text-cream/55 light:text-black/55">
                    #{invoice?.kode || kode || '-'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row print:hidden">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-black"
                >
                  <Download size={16} />
                  Download Invoice
                </button>
                <button
                  type="button"
                  onClick={() => printInvoice()}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/30 bg-white/5 px-5 py-3 text-sm font-semibold text-cream light:border-black/15 light:bg-black/5 light:text-charcoal"
                >
                  <Printer size={16} />
                  Print / Save PDF
                </button>
              </div>
            </div>

            <div className="relative grid gap-5 py-8 md:grid-cols-4">
              <div className="rounded-3xl border border-white/10 bg-white/[.045] p-5 light:border-black/10 light:bg-black/[.035]">
                <p className="text-cream/45 light:text-black/45">Client</p>
                <h3 className="mt-2 text-xl font-semibold">
                  {invoice?.customerName || user?.name || '-'}
                </h3>
                <p className="mt-1 text-sm text-cream/55 light:text-black/55">
                  {invoice?.whatsapp || user?.whatsapp || '-'}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[.045] p-5 light:border-black/10 light:bg-black/[.035]">
                <p className="text-cream/45 light:text-black/45">Event</p>
                <p className="mt-2 font-semibold">{invoice?.eventType || '-'}</p>
                <p className="text-sm text-cream/55 light:text-black/55">
                  {invoice?.eventDate || '-'} · {invoice?.eventLocation || '-'}
                </p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[.045] p-5 light:border-black/10 light:bg-black/[.035]">
                <p className="text-cream/45 light:text-black/45">Payment</p>
                <p className="mt-2 font-semibold">{invoice?.paymentMethod || '-'}</p>
                <p className="text-sm text-cream/55 light:text-black/55">
                  Order: {invoice?.orderCode || '-'}
                </p>
              </div>
              <div className="rounded-3xl border border-gold/20 bg-gold/10 p-5">
                <p className="text-cream/45 light:text-black/45">Status</p>
                <div className="mt-2">
                  <StatusBadge status={invoice?.status || 'Pending'} />
                </div>
                <p className="mt-3 text-sm text-cream/55 light:text-black/55">
                  Due: {invoice?.dueDate || '-'}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gold/20">
              <table className="w-full text-left">
                <thead className="bg-gold/10 text-gold">
                  <tr>
                    <th className="p-4">Item</th>
                    <th className="p-4 text-center">Qty</th>
                    <th className="p-4 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((item) => (
                    <tr key={item.name} className="border-t border-white/10 light:border-black/10">
                      <td className="p-4">{item.name}</td>
                      <td className="p-4 text-center">{item.qty}</td>
                      <td className="p-4 text-right">{rupiah(item.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-[1fr_360px]">
              <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5 text-sm text-cream/60 light:border-black/10 light:bg-black/[.035] light:text-black/60">
                <b className="text-cream light:text-charcoal">Notes</b>
                <p className="mt-2">{invoice?.notes || '-'}</p>
                <p className="mt-4">Issued: {invoice?.issuedAt || '-'}</p>
              </div>
              <div className="rounded-3xl border border-gold/20 bg-black/30 p-5 light:bg-white">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <b>{rupiah(invoice?.subtotal || 0)}</b>
                </div>
                <div className="flex justify-between py-2">
                  <span>Discount</span>
                  <b>- {rupiah(invoice?.discount || 0)}</b>
                </div>
                <div className="flex justify-between border-t border-white/10 py-3 text-xl">
                  <span>Total</span>
                  <b className="text-gold">{rupiah(invoice?.total || 0)}</b>
                </div>
                <div className="flex justify-between py-2">
                  <span>Paid</span>
                  <b>{rupiah(invoice?.paid || 0)}</b>
                </div>
                <div className="flex justify-between py-2">
                  <span>Remaining</span>
                  <b>{rupiah(invoice?.remaining || 0)}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
