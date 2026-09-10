import { useTranslations, useLocale } from "next-intl";
import AppPreviewPhones, { type Phone } from "./AppPreviewPhones";

// Real Simulator screenshots (public/screenshots/<locale>), shown as a three
// phone row. Center phone (the result screen with price + recommended
// marketplace) is the payoff, so it sits slightly larger and forward.
// Screenshots are captured per language so the app UI matches the page locale.
// `enter` only drives the on-scroll entrance animation (see AppPreviewPhones).
const shots = [
  { name: "welcome", side: true, enter: "left" },
  { name: "result", side: false, enter: "center" },
  { name: "comparison", side: true, enter: "right" },
] as const;

// Locales for which localized screenshots exist; others fall back to English.
const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

export default function AppPreview() {
  const t = useTranslations("AppPreview");
  const locale = useLocale();
  const shotLocale = SHOT_LOCALES.has(locale) ? locale : "en";
  const alt = t("promoAlt");

  // Image/locale logic is unchanged — same src template, same locale fallback;
  // we just package each phone's data for the (client) animated row.
  const phones: Phone[] = shots.map((s) => ({
    name: s.name,
    side: s.side,
    enter: s.enter,
    src: `/screenshots/${shotLocale}/${s.name}.png`,
    alt,
    priority: !s.side,
  }));

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
          <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <AppPreviewPhones phones={phones} />
      </div>
    </section>
  );
}
