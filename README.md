# MySellingMate — Website

Marketing site for the MySellingMate iOS app. Statically exported Next.js, four
locales (EN/IT/ES/DE), and the App Store-required legal pages (privacy, terms,
support) that the app links to from inside Settings.

Production: **https://mysellingmate.myellelab.com**

**Stack:** Next.js 16 (App Router, `output: 'export'`) · next-intl · Tailwind v4 · TypeScript

---

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000 → auto-redirects to /en/
```

Other scripts:

```bash
npm run build        # production static export → ./out
npm run lint         # eslint
```

Node 20+ (developed on Node 25, npm 11).

---

## Routes

`localePrefix` is `always` and `trailingSlash` is `true`, so **every** URL carries
a locale segment and a trailing slash. There is no bare `/privacy/` — it 404s.

| Page    | URL                                                            |
| ------- | -------------------------------------------------------------- |
| Home    | `/en/`, `/it/`, `/es/`, `/de/`                                  |
| Privacy | `/en/privacy/`, `/it/privacy/`, `/es/privacy/`, `/de/privacy/`  |
| Terms   | `/en/terms/`, `/it/terms/`, `/es/terms/`, `/de/terms/`          |
| Support | `/en/support/`, `/it/support/`, `/es/support/`, `/de/support/`  |

`/` is a client-side redirect page (see below), not a real document with content.

---

## How it deploys

`npm run build` writes a fully static site to `./out`. No server, no serverless
functions, no environment variables — it can be dropped on any static host.

- **Build command:** `npm run build`
- **Output directory:** `out`
- **Install command:** `npm install`

Because the export is host-agnostic, don't add server-only Next.js features
(middleware, server actions, dynamic route handlers) — they break `output: 'export'`.

The host must serve directory-style URLs (`/en/privacy/` → `out/en/privacy/index.html`).
Vercel, Netlify, Cloudflare Pages and GitHub Pages all do this by default.

### Domain

`SITE_URL` in `i18n/metadata.ts` is the single source of truth for canonical
URLs, hreflang alternates, OG image URLs, `sitemap.xml` and `robots.txt`. It is
baked in **at build time** — changing the domain means changing that constant and
rebuilding. If the apex ever redirects to `www`, use the `www` form so canonical
tags don't point at a redirect hop.

---

## Architecture

```
i18n/
  routing.ts      locales, defaultLocale, localePrefix:'always', native names, og:locale codes
  navigation.ts   locale-aware <Link>, useRouter, usePathname
  request.ts      loads messages/<locale>.json (no headers/cookies → static-export safe)
  metadata.ts     SITE_URL, OG_IMAGE, hreflang helper
messages/
  en|it|es|de.json   all UI copy — no strings live in components
app/
  layout.tsx          passthrough root layout
  page.tsx            "/" → client-side navigator.language detect + NEXT_LOCALE cookie → redirect
  not-found.tsx       404
  sitemap.ts          per-URL hreflang alternates (force-static)
  robots.ts           allow-all + sitemap (force-static)
  globals.css         brand CSS variables — the only place colors are defined
  [locale]/
    layout.tsx        <html lang>, NextIntlClientProvider, canonical + hreflang + OG/Twitter
    page.tsx          section composition
    privacy/ terms/ support/
  components/         Navbar, LanguagePicker, HeroSection, AppPreview, StatsBar,
                      FeatureGrid, LanguageGrid, HowItWorks, Footer, GridBackground
public/
  screenshots/        Simulator captures used by AppPreview
  og-image.jpg        1200×630 social card
tools/
  og-card-template.html   editable 1200×630 card to screenshot for the OG image
```

### Why no middleware?

Static export has no server, so the usual next-intl middleware (which reads
`Accept-Language` and sets a cookie) can't run. Instead `app/page.tsx` detects the
language **client-side**: `NEXT_LOCALE` cookie first, then `navigator.languages`,
then the default locale — and redirects to `/<locale>/`. The language picker
writes that cookie so the choice persists.

### Adding a locale

Add the code to `locales` in `i18n/routing.ts`, add its native name to
`localeNames` and its full code to `ogLocales`, then create a matching
`messages/<locale>.json`. Everything else (sitemap, hreflang, picker, static
params) is generated from that list.

---

## Assets

### Icons — two masters, on purpose

Icon assets are generated from **two** masters in `design/` (gitignored — keep a
copy with the app's design sources). Both are built from
`design/app-icon-source.jpeg`, the 1024² file delivered by design. Keep delivered
masters out of `public/`: everything in `public/` is published verbatim, and a
full-size master has no business being served. Which master an asset comes from
is not arbitrary:

| Asset | Master | Why |
| --- | --- | --- |
| `public/favicon-192.png` | `app-icon.png` (1024², untrimmed) | Must stay pixel-identical to the iOS app icon |
| `public/favicon-512.png` | `app-icon.png` | Same |
| `public/apple-touch-icon.png` | `app-icon.png` | iOS applies its own mask; the icon's built-in padding is what makes it sit correctly |
| `app/favicon.ico` (16/32/48) | `app-icon-trimmed.png` (672²) | Legibility at tab size |
| `public/favicon-32.png` | `app-icon-trimmed.png` | Same |
| `public/app-icon-56.png` (navbar, renders 28px) | `app-icon-trimmed.png` | Same |

The glyph is **landscape** (555×408 inside the 1024² master) and fills only
**54%** of the untrimmed master's width, so at 16px it collapses to about 8px
across. The trimmed master is a 672×672 crop of the original centred on the
glyph, which brings the fill to **83%** (82.6% exactly). Do not regenerate the
large sizes from the trimmed master — the padding they lose is the padding
Apple's mask expects.

**Recompute the crop window on every icon change.** The numbers below are
specific to the glyph in place when they were written. A replacement glyph will
have a different bounding box, and may not be square: size the square window to
the glyph's longer side, then centre it on the bbox. The 83% fill is the target
to hold, not the 672. Full geometry for the current mark, including the padding
it lands on, is in `design/_icon-measurements-20260913/NOTE.md`.

To rebuild the trimmed master after an icon change (ImageMagick):

```bash
magick design/app-icon-source.jpeg design/app-icon.png  # untrimmed master, JPEG -> PNG
magick design/app-icon.png -fuzz 12% -trim info:        # read the glyph bbox
# size a square window to (longer side / 0.83), centre it on the bbox, then:
magick design/app-icon.png -crop 672x672+175+167 +repage design/app-icon-trimmed.png
```

`public/favicon.ico` is **dead** — `app/favicon.ico` is the App Router
convention file and wins at `/favicon.ico`. It is kept in sync only so the repo
never carries two different icons under one name.

#### What a replacement mark has to survive

`app/favicon.ico` renders at **16px** in a browser tab, which is a 42:1
downsample from a 672² master or 35:1 from a 566² one. At that ratio the binding
constraint is not the glyph's size but the width of the gaps **inside** it:

- **Any internal separator thinner than one pixel at 16px will not render as
  separation.** It averages into the surrounding ink and the mark reads as a
  smear. Measure this before adopting a mark: take the black runs along
  scanlines crossing the glyph, divide by the downsample ratio, and check how
  many land below 1.0.
- **The mark currently shipping fails this test, knowingly.** 76% of its
  separators fall below one pixel at 16px and 53% below one pixel at 32px. It is
  legible at 28px in the navbar, busy but readable at 32px, and degrades to a
  textured smear in a 16px tab. It was adopted anyway so the web and the iOS app
  show the same mark. See `design/_icon-measurements-20260913/NOTE.md`.
- Cropping does not rescue detail density. Fill is already at 82.6%, and 100%
  fill would buy only 2.8px of width. A mark that fails this test needs a
  simplified small-size variant for the 16 and 32 ICO frames. That is the fix if
  the 16px rendering is ever worth revisiting.
- JPEG compression in a delivered master is **not** usually the problem. On this
  same mark, removing every trace of ringing changed the 16px render by at most
  2/255. Check detail density first.

### Everything else

- **AppPreview** renders three real Simulator screenshots from `public/screenshots/`
  as a phone row — the center phone (the result screen) is the payoff and sits larger.
- **OG card** must be **JPG or PNG, never WebP** — WhatsApp shows no preview at all
  for WebP, and none if `og:image` is missing. 1200×630, under 200KB, absolute URL
  (handled via `SITE_URL`). Regenerate from `tools/og-card-template.html`: open in
  Chrome, DevTools device toolbar at 1200×630, "Capture full size screenshot",
  then `sips -s format jpeg shot.png --out og-image.jpg`.
- After a deploy that changes the card, flush caches with the
  [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — it
  also refreshes what WhatsApp reads.
- Compress before committing: promo/hero images under 500KB, OG under 200KB.
  Design sources (`.psd`, `.fig`, oversized PNGs) are gitignored — commit exports.
