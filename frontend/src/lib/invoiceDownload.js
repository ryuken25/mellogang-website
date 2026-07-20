/**
 * Client-side invoice download helpers.
 * Prefer real PDF via print dialog when available; fall back to HTML file download.
 */

function safeFilename(kode) {
  const raw = String(kode || 'invoice').trim() || 'invoice'
  return raw.replace(/[^a-zA-Z0-9._-]+/g, '-')
}

/**
 * Trigger browser print dialog (user can Save as PDF).
 * Returns true if print was invoked.
 */
export function printInvoice() {
  if (typeof window === 'undefined' || typeof window.print !== 'function') {
    return false
  }
  window.print()
  return true
}

/**
 * Download a self-contained HTML invoice snapshot as a file.
 * Works even when print is blocked (mobile browsers, sandboxed webviews).
 */
export function downloadInvoiceHtml(invoice, user) {
  if (typeof document === 'undefined' || !invoice) return false

  const kode = invoice.kode || invoice.orderCode || 'invoice'
  const filename = `invoice-${safeFilename(kode)}.html`
  const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(n) || 0)

  const rows = (invoice.items || [])
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(item.name || '-')}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${escapeHtml(String(item.qty ?? 1))}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(rupiah(item.price))}</td>
        </tr>`
    )
    .join('')

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(kode)}</title>
  <style>
    body { font-family: Inter, Helvetica, Arial, sans-serif; color:#0b0f0e; margin:32px; background:#fff; }
    h1 { margin:4px 0 0; font-size:28px; }
    .brand { color:#00B98B; letter-spacing:.08em; text-transform:uppercase; font-weight:700; font-size:12px; }
    .meta { color:#64748b; font-size:13px; }
    .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; margin:24px 0; }
    .card { border:1px solid #e5e7eb; border-radius:16px; padding:14px; }
    table { width:100%; border-collapse:collapse; margin-top:12px; }
    th { background:#f3f6f8; text-align:left; padding:10px 12px; font-size:12px; color:#64748b; text-transform:uppercase; }
    .totals { margin-top:18px; max-width:360px; margin-left:auto; }
    .totals div { display:flex; justify-content:space-between; padding:6px 0; }
    .totals .total { font-size:18px; font-weight:700; border-top:1px dashed #d1d5db; margin-top:8px; padding-top:10px; }
  </style>
</head>
<body>
  <div class="brand">Mellogang Visuals</div>
  <h1>Premium Invoice</h1>
  <p class="meta">#${escapeHtml(kode)} · Issued ${escapeHtml(invoice.issuedAt || '-')}</p>

  <div class="grid">
    <div class="card">
      <div class="meta">Client</div>
      <strong>${escapeHtml(invoice.customerName || user?.name || '-')}</strong><br/>
      <span class="meta">${escapeHtml(invoice.whatsapp || user?.whatsapp || '-')}</span>
    </div>
    <div class="card">
      <div class="meta">Event</div>
      <strong>${escapeHtml(invoice.eventType || '-')}</strong><br/>
      <span class="meta">${escapeHtml(invoice.eventDate || '-')} · ${escapeHtml(invoice.eventLocation || '-')}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:center;">Qty</th>
        <th style="text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="3" style="padding:12px;">No line items</td></tr>'}
    </tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal</span><strong>${escapeHtml(rupiah(invoice.subtotal))}</strong></div>
    <div><span>Discount</span><strong>- ${escapeHtml(rupiah(invoice.discount))}</strong></div>
    <div class="total"><span>Total</span><strong>${escapeHtml(rupiah(invoice.total))}</strong></div>
    <div><span>Paid</span><strong>${escapeHtml(rupiah(invoice.paid))}</strong></div>
    <div><span>Remaining</span><strong>${escapeHtml(rupiah(invoice.remaining))}</strong></div>
  </div>

  <p class="meta" style="margin-top:28px;">Notes: ${escapeHtml(invoice.notes || '-')}</p>
  <p class="meta">Order: ${escapeHtml(invoice.orderCode || '-')} · Payment: ${escapeHtml(invoice.paymentMethod || '-')} · Status: ${escapeHtml(invoice.status || '-')}</p>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1500)
  return true
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}
