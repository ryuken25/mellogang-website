# Mellogang Visuals Brand Scrape Report

Scrape timestamp: generated during redesign task.

## Sources

| Source | URL | Result |
| --- | --- | --- |
| Instagram | `https://www.instagram.com/mellogangvisuals/embed/` | Accessible. Parsed `contextJSON` from embed payload and downloaded six real profile thumbnails to `frontend/public/brand/instagram/`. Direct profile URL still redirects to login, but embed contains public profile media. |
| Linktree | `https://linktr.ee/mellogangvisuals` | Accessible and parsed from embedded `__NEXT_DATA__` JSON + meta tags. |

## Extracted Brand Data

| Field | Value |
| --- | --- |
| Username | `mellogangvisuals` |
| Handle | `@mellogangvisuals` |
| Description | `Mellogang Visuals \| Profesional Videographer` |
| Country | `ID` |
| Timezone | `Asia/Makassar` |
| Joined Linktree | November 2021 |
| Linktree theme | `air-black` |
| Theme background | `#2A3236` |
| Logo/avatar source | `https://ugc.production.linktr.ee/cYeNly6RXe1ERgMAOmB3_IVvt16cap7Ucb1O7` |
| Local logo asset | `frontend/public/brand/mellogang-logo.png` |
| Local OG asset | `frontend/public/brand/mellogang-og.jpg` |

## Extracted Instagram Media

| Local file | Source shortcode | Type | Notes |
| --- | --- | --- | --- |
| `frontend/public/brand/instagram/ig-01.jpg` | `DZw1TfUk09u` | Sidecar | Traditional wedding portrait |
| `frontend/public/brand/instagram/ig-02.jpg` | `DZum-PFu1dW` | Video thumbnail | Bali ceremony / outdoor ambience |
| `frontend/public/brand/instagram/ig-03.jpg` | `DX9po8APqun` | Video thumbnail | Graduation candid |
| `frontend/public/brand/instagram/ig-04.jpg` | `DXyYifvu9mE` | Video thumbnail | Family ceremony moment |
| `frontend/public/brand/instagram/ig-05.jpg` | `DW7oziYD3zT` | Video thumbnail | Traditional wedding film frame |
| `frontend/public/brand/instagram/ig-06.jpg` | `DUjhTPkkvGR` | Video thumbnail | Black-and-white wedding story frame |

## Extracted Social Links

| Title | URL |
| --- | --- |
| WHATSAPP | Linktree exposes masked `https://wa.me/+628****4917`; frontend links to official Linktree to avoid inventing hidden digits. |
| INSTAGRAM | `https://www.instagram.com/mellogangvisuals/` |
| YOUTUBE | `https://www.youtube.com/@mellogangvisuals` |
| LINKEDIN | `https://www.linkedin.com/in/kadek-darmadi-8674a2241/` |

## Extracted Palette

Dominant colors from downloaded logo/avatar:

| Color | Meaning |
| --- | --- |
| `#202020` | dominant charcoal / black base |
| `#202030` | dark blue-black secondary |
| `#303030` | neutral dark surface |
| `#00f0c0` | turquoise accent detected in logo |
| `#10b090` | deep turquoise accent |
| `#2A3236` | Linktree air-black background |

Frontend Tailwind accent was updated from warm gold to Mellogang turquoise while keeping the premium cinematic dark layout.
