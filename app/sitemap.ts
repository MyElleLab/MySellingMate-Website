import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/i18n/metadata";

// Required so the route is emitted as a static file under `output: 'export'`.
export const dynamic = "force-static";

// Locale-prefixed paths (without the leading locale). "" is the home page.
const PATHS = ["", "/privacy", "/terms", "/support"];

// One entry per locale per page, each listing all locale alternates (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}/`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}/`])
        ),
      },
    }))
  );
}
