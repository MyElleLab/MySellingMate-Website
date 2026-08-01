import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/metadata";

// Required so the route is emitted as a static file under `output: 'export'`.
export const dynamic = "force-static";

// Allow all crawlers on every locale; point them at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
