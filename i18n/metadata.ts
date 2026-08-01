import { routing } from "./routing";

// ────────────────────────────────────────────────────────────────────────────
// Set this to your PRODUCTION domain — the one actually served to users.
// If your apex (example.com) redirects to www.example.com, use the www form so
// canonical/hreflang/OG URLs point at the served domain, not a redirect target.
// ────────────────────────────────────────────────────────────────────────────
export const SITE_URL = "https://mysellingmate.myellelab.com";

// Absolute URL to the social card (JPG/PNG, NOT WebP — WhatsApp rejects WebP).
export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// Builds the hreflang `alternates.languages` map for a path (without the locale
// prefix, e.g. "/privacy" or "" for home). Includes x-default.
export function localeAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `/${locale}${path}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${path}`;
  return languages;
}
