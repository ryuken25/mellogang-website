export const mockOrders = [
  {
    id: 'order-mlg-001', kode: 'MLG-ORD-2026-001', kode_pemesanan: 'MLG-ORD-2026-001', invoiceCode: 'INV-MLG-2026-001',
    customerEmail: 'dummy@dummy.com', customerName: 'Dummy Client', packageName: 'Wedding Cinematic Highlight', nama_paket: 'Wedding Cinematic Highlight',
    eventType: 'Balinese Wedding Ceremony', eventDate: '2026-08-18', tanggal_acara: '2026-08-18', eventLocation: 'Ubud, Bali',
    paymentStatus: 'DP Verified', status_pemesanan: 'DP Verified', productionStatus: 'Editing Progress', status_produksi: 'Editing Progress', editingProgress: 65, progress: 65,
    editorName: 'Mellogang Editing Team', total_biaya: 5500000, notes: 'Highlight film sedang masuk tahap color grading dan music sync.',
    timeline: [
      { label: 'Booking Created', date: '2026-07-08 10:15 WITA', status: 'done' },
      { label: 'DP Uploaded', date: '2026-07-08 11:20 WITA', status: 'done' },
      { label: 'DP Verified', date: '2026-07-08 13:05 WITA', status: 'done' },
      { label: 'Production Scheduled', date: '2026-08-18 08:00 WITA', status: 'done' },
      { label: 'Editing Progress', date: 'In progress', status: 'active' },
      { label: 'Final Delivery', date: 'Pending', status: 'pending' },
    ],
  },
]
