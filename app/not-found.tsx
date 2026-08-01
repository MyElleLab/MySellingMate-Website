"use client";

import Error from "next/error";

// Rendered for any path that doesn't resolve to a locale route. It sits outside
// the `[locale]` segment, so it provides its own <html>/<body>.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
