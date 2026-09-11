import { useTranslations, useLocale } from "next-intl";
import AppPreviewMockup from "./AppPreviewMockup";

// Locales for which localized screenshots exist; others fall back to English.
const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

// The phone showcase: a code-built realistic iPhone mockup (see AppPreviewMockup)
// showing the localized result screen — the "photo → price" payoff — revealing
// with a 3D rotation as it scrolls into view.
export default function AppPreview() {
  const t = useTranslations("AppPreview");
  const locale = useLocale();
  const shotLocale = SHOT_LOCALES.has(locale) ? locale : "en";

  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
          <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <AppPreviewMockup src={`/screenshots/${shotLocale}/result.png`} alt={t("promoAlt")} />
      </div>
    </section>
  );
}
