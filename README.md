# Valangel Skin — landing & storefront

Astro + React storefront for **Valangel Skin**, built on the same architecture as
`impoven-landing` and pointed at the same CMS (`impoven-cms`, Strapi v5), with a
new brand system: rosé palette, Playfair Display / Montserrat / Cormorant, and a
mobile-first navigation model.

**Live preview:** https://devopslp.github.io/valangel-landing/

---

## What it does

Everything the Impoven landing did, plus the pieces an actual storefront needs.

| Carried over from `impoven-landing` | Where it lives |
| --- | --- |
| Cart shared across React islands (localStorage, module singleton) | `src/lib/cartStore.ts`, `src/context/CartContext.tsx` |
| WhatsApp order builder | `src/lib/cart.ts` |
| Google Maps address picker with graceful text fallback | `src/components/cart/ShippingMap.tsx` |
| BCV rate (Bs/USD) fetched once per page load | `src/lib/exchangeRateStore.ts` |
| Saved customer profile + addresses | `src/lib/userProfile.ts` |
| Product quick view with markdown descriptions | `src/components/shop/QuickView.tsx` |
| Catalog with category filters, search and deep links | `src/components/shop/ShopBrowser.tsx` |
| CMS-driven hero slides with bundled fallbacks | `src/components/home/Hero.tsx` |
| Share-a-product links | `src/components/ui/ShareButton.tsx` |

| New | Where it lives |
| --- | --- |
| Multi-step checkout (datos → entrega → confirmar) with payment and delivery methods | `src/components/cart/CheckoutModal.tsx` |
| Favourites / wishlist, synced across islands | `src/lib/wishlistStore.ts`, `/favoritos` |
| Full-screen search overlay with live results | `src/components/layout/SearchOverlay.tsx` |
| Mobile drawer nav + persistent bottom tab bar | `src/components/layout/MobileNav.tsx`, `MobileTabBar.tsx` |
| Desktop mega menu | `src/components/layout/Header.tsx` |
| "Crea tu rutina" questionnaire that builds and adds a whole routine | `src/lib/routines.ts`, `src/components/shop/RoutineQuiz.tsx` |
| Brand index + per-brand pages | `/marcas`, `/marcas/[slug]` |
| Blog with bundled posts | `/blog`, `/blog/[slug]` |
| Free-shipping progress in the cart | `src/lib/cart.ts` |
| Shipping, returns, terms and privacy pages | `/envios`, `/cambios-y-devoluciones`, `/terminos` |
| Newsletter opt-in posting to the CMS | `src/components/home/NewsletterForm.tsx` |

## Data: CMS first, fallback always

`src/lib/strapi.ts` tries `/api/products`, then `/api/parts` (the collection
`impoven-cms` already ships), then the bundled catalog in `src/lib/catalog.ts`.
The storefront is therefore fully browsable with the CMS offline — which is what
makes the static GitHub Pages preview work end to end.

Placeholder imagery comes from free Unsplash photos, built through the
`unsplash()` helper in `src/lib/catalog.ts`. Swapping in real product photography
means changing the `images` on each product (or populating the CMS) — nothing
else references those URLs.

## Brand system

Tokens live in `src/styles/global.css` and come straight from the brand board:

| Token | Value | Use |
| --- | --- | --- |
| `--color-rose` | `#F5DADF` | Pantone 705 C — primary |
| `--color-rose-light` | `#F9E7E7` | soft backgrounds |
| `--color-rose-shadow` | `#E4C0C1` | Pantone 7604 C |
| `--color-mauve` | `#D9AFAF` | Pantone 7520 C |
| `--color-champagne` | `#C89A83` | Pantone 7521 C |
| `--color-taupe` | `#A88374` | Pantone 7525 C |
| `--color-snow` | `#F4F0EA` | Pantone 11-0602 TCX |
| `--color-chrome` | `#D9D9D9` | metallic accent |
| `--color-wine` | `#6E2A38` | display headings (10.2:1 on white) |
| `--color-ink` | `#3D2C2E` | body copy |
| `--color-cocoa` | `#8A6153` | solid buttons (5.4:1 with white) |
| `--color-muted` | `#7A6663` | secondary copy (5.4:1 on white) |

Type: **Playfair Display** (display), **Montserrat** (UI), **Cormorant Garamond
italic** (script accents). The `.grad-rose` / `.grad-cream` / `.grad-silk`
utilities stand in for the brand's poured-cream textures.

## Running it

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve dist/
npm run check      # astro + TypeScript diagnostics
```

Copy `.env.example` to `.env` and fill in what you need. Every variable has a
working default, so `npm run dev` works with no configuration at all.

## Deployment

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push
to `main`. Because a project site is served from `/valangel-landing/`, CI sets
`PUBLIC_BASE_PATH`; all internal links go through the `u()` helper in
`src/lib/url.ts` so the same source works at any base path.

To point the preview at a live CMS, add these repository secrets:
`PUBLIC_STRAPI_URL`, `PUBLIC_STRAPI_TOKEN`, `PUBLIC_GOOGLE_MAPS_API_KEY`,
`PUBLIC_WA_NUMBER`.

## Before going live

- Replace `PUBLIC_WA_NUMBER` with Valangel's own WhatsApp number (it currently
  defaults to Impoven's).
- Fill in the business's legal details on `/terminos` (legal name, RIF) — the
  page is written to be accurate about how the store actually operates, but it
  carries no registration data.
- Swap the Unsplash placeholders for real product photography.
- Add a Google Maps API key restricted by HTTP referrer if you want the map
  picker in checkout.
