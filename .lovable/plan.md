
# Anfas Restaurant — Website Plan

Mirror the structure/style of https://damascene.vercel.app but rebrand for **مطعم أنفاس للمشويات التركية** with a white + red palette and a Turkish grill identity.

## Brand & Design

- **Name:** أنفاس / ANFAS
- **Tagline:** مشويات تركية أصيلة — جدة
- **Palette (from your pick):**
  - Background: `#ffffff`
  - Soft surface: `#f7f2ee`
  - Ink / text: `#1a1a1a`
  - Red accent (CTA, highlights): `#c8102e`
- **Typography:** Arabic-first pairing — `Tajawal` or `Cairo` for body, a display Arabic (e.g. `Rubik` / `Amiri` for accents). Latin fallback for `ANFAS` wordmark.
- **Language:** Arabic (RTL) primary, matching the current site.
- **Logo:** simple wordmark "أنفاس / ANFAS" with a small flame mark in red (I'll generate).

## Sections (single-page + supporting routes)

1. **Hero** — Full-width photo of Turkish grill/mixed platter, restaurant name in large Arabic type, red CTA "احجز طاولة" + secondary "عرض المنيو".
2. **About / قصتنا** — Short intro: authentic Turkish grill in Jeddah, cozy modern atmosphere.
3. **Signature dishes** — Grid of 6 highlighted plates (Adana, Urfa, Shish, Kofte, Mixed grill, Künefe) with photos + short descriptions.
4. **Menu preview** — Card linking to full menu (`/menu`) plus a "تحميل المنيو PDF" button pointing to their existing menu.pdf.
5. **Atmosphere gallery** — 4–6 image masonry (interior, grill, plating, live music note).
6. **Features strip** — Icons for: طعام حلال، جلسات عائلية، موسيقى حية، مواقف مجانية، توصيل، مناسب للكراسي المتحركة.
7. **Visit us** — Address (6889 صقر قريش، السلامة، جدة 23436), hours (يغلق ٤ص), phone (053 490 0038), Google Maps embed, Instagram link.
8. **Footer** — Logo, socials, copyright.

## Routes

```
src/routes/
  __root.tsx        header (nav + logo) + footer
  index.tsx         home (all sections above)
  menu.tsx          full menu page (categories + PDF link)
  contact.tsx       location, hours, contact form (optional)
```

Each route gets its own `head()` metadata (title, description, og:title, og:description) in Arabic + English.

## Technical Details

- TanStack Start (existing template), Tailwind v4 tokens defined in `src/styles.css` under `@theme` + `:root` using `oklch` equivalents of the palette.
- RTL: set `dir="rtl" lang="ar"` on `<html>` in `__root.tsx` shell.
- Fonts loaded via `<link>` in `__root.tsx` head (Google Fonts: Tajawal + Rubik).
- Images: generated hero + dish + interior shots saved to `src/assets/`, imported as ES modules.
- Icons: `lucide-react` for feature strip.
- Motion: subtle fade/slide-in on scroll (Motion/React), restrained.
- No backend needed unless you want a reservation form — currently plan uses a `tel:` / WhatsApp CTA instead.

## Open items (confirm or I'll default)

- **Reservations form?** Default: no form — CTAs go to phone (`tel:0534900038`) and WhatsApp. Say the word if you want a real form (needs Lovable Cloud for storage/email).
- **Delivery links?** I'll add generic "اطلب أونلاين" button; give me HungerStation/Jahez/Toyou links if you have them.
- **Logo:** I'll generate a red flame + "أنفاس" wordmark. Send an existing logo if the client has one.
