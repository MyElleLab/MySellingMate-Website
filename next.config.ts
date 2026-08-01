import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Static export: builds to `out/` and deploys to any static host (not Vercel-only).
  output: "export",
  trailingSlash: true,
  images: {
    // Required for static export — images are served as-is, no optimizer.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
