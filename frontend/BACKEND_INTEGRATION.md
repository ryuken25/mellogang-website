# Backend Integration Notes

The existing CodeIgniter 4 backend remains the source of truth for business logic:

- Auth and OTP verification
- Role-based dashboards: Admin, Editor, Pelanggan
- Order creation and availability checks
- Payment proof upload and admin verification
- Production schedule assignment
- Editor progress updates: `pra_produksi → shooting → cut_to_cut → finishing → done`, with revision states
- Invoice, reports, portfolio/package CRUD

## Additive JSON endpoints

These API routes were added without deleting or replacing backend views:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/packages` | Active package cards for React Katalog |
| GET | `/api/portfolio` | Portfolio/gallery items with normalized thumbnails |
| GET | `/api/brand` | Scraped Mellogang brand metadata/social links for React UI |
| GET | `/api/order-status?kode=...` | Public order tracking payload |
| GET | `/api/dashboard/admin-summary` | Admin summary metrics (role-protected) |

## Frontend consumption

The Vercel React frontend reads `VITE_API_BASE_URL` and calls the endpoints above. If no backend URL is configured, it falls back to mock data so the visual demo is still complete.

## Deployment split

Vercel hosts the static React app only. CodeIgniter 4 + PHP + MySQL/MariaDB should stay on PHP-capable hosting: existing shared hosting, Railway/Render container, VPS, or similar.
