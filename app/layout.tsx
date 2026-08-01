import type { ReactNode } from "react";

// The real layout (with <html> + <body>) lives in `app/[locale]/layout.tsx`.
// This root layout only exists because `app/page.tsx` (the locale redirect) and
// `app/not-found.tsx` sit outside the `[locale]` segment. It passes children
// through; those routes render their own <html>/<body>.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
