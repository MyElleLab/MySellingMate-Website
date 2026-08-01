import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Supported locales. Add/remove here and create a matching messages/<locale>.json.
  locales: ["en", "it", "es", "de"],

  // Used when no locale matches.
  defaultLocale: "en",

  // Always prefix URLs with the locale (/en, /it, ...). Required for static
  // export so every locale gets its own pre-rendered set of HTML files.
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// Native language names, shown in the language picker.
export const localeNames: Record<Locale, string> = {
  en: "English",
  it: "Italiano",
  es: "Español",
  de: "Deutsch",
};

// Full BCP-47-ish codes for og:locale (WhatsApp/Facebook expect en_US, not en).
export const ogLocales: Record<Locale, string> = {
  en: "en_US",
  it: "it_IT",
  es: "es_ES",
  de: "de_DE",
};
