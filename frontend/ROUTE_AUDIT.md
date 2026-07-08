# Mellogang Visuals Route Audit

| Route | Purpose | Access | Behavior |
|---|---|---|---|
| `/` | Home | Public | Premium public landing page. |
| `/katalog` | Packages | Public | Shows packages; booking CTAs enter protected booking flow. |
| `/portofolio` | Portfolio | Public | Cinematic portfolio, IG frames, YouTube films. |
| `/portfolio` | Portfolio alias | Public | Redirects to `/portofolio`. |
| `/kontak` | Contact | Public | Social links and WhatsApp CTA. |
| `/status` | Order status | Public + customer | Public lookup and logged-in customer orders/invoice entry. |
| `/status-pesanan` | Order status alias | Public + customer | Same as `/status`. |
| `/auth` | Auth | Public | Query `mode=signin/signup`; supports demo login and redirect param. |
| `/auth?mode=signin` | Sign in | Public | Demo login `dummy@dummy.com` / `dummy`; redirects to intended route. |
| `/auth?mode=signup` | Sign up UI | Public | Redirect-ready backend registration UI. |
| `/login` | Legacy sign in | Public | Redirects to `/auth?mode=signin`. |
| `/register` | Legacy sign up | Public | Redirects to `/auth?mode=signup`. |
| `/invoice` | Invoice empty state | Protected | Requires login; shows invoice-available-after-order state. |
| `/invoice?kode=INV-MLG-2026-001` | Invoice detail | Protected | Renders invoice only if code belongs to logged-in demo user. |
| `/invoice/:kode` | Invoice detail alias | Protected | Same as query-param invoice route. |
| `/profile` | Customer profile | Protected | Shows current demo profile from localStorage. |
| `/profile/edit` | Edit profile | Protected | Updates demo profile in `mellogang_auth_user`. |
| `/pelanggan` | Customer alias | Protected | Redirects to `/pelanggan/dashboard`. |
| `/pelanggan/dashboard` | Customer dashboard | Protected | Shows existing customer dashboard component. |
| `/pelanggan/status` | Customer status alias | Protected | Redirects to `/status`. |
| `/pelanggan/pemesanan/buat/:packageId` | Booking/order form | Protected | Package `1` opens demo booking form; invalid package shows not found state. |
| `/admin` | Admin dashboard preview | Public demo | Renders dashboard preview safely. |
| `/editor` | Editor dashboard preview | Public demo | Renders dashboard preview safely. |
| `*` | Catch-all | Public | Premium 404 page, not ErrorBoundary. |
