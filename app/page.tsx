"use client";

import { useEffect } from "react";
import { routing } from "@/i18n/routing";

// Root URL ("/") for the static export. There is no server/middleware to read
// `Accept-Language`, so we detect the visitor's language on the client:
//   1. A previously chosen locale (NEXT_LOCALE cookie) wins.
//   2. Otherwise match the browser's preferred languages.
//   3. Otherwise fall back to the default locale.
// Then redirect to the locale-prefixed home page.
function detectLocale(): string {
  const locales = routing.locales as readonly string[];

  const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const stored = cookieMatch?.[1];
  if (stored && locales.includes(stored)) return stored;

  const preferred = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const lang of preferred) {
    const base = lang.toLowerCase().split("-")[0];
    if (locales.includes(base)) return base;
  }

  return routing.defaultLocale;
}

export default function RootRedirectPage() {
  useEffect(() => {
    // `trailingSlash: true`, so target the slashed path.
    window.location.replace(`/${detectLocale()}/`);
  }, []);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0d1117",
          color: "#7d8590",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Visible only briefly before the redirect; also a no-JS fallback. */}
        <noscript>
          <a href={`/${routing.defaultLocale}/`} style={{ color: "#2dd4bf" }}>
            Continue
          </a>
        </noscript>
      </body>
    </html>
  );
}
