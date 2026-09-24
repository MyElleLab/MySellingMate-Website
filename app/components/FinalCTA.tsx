import { useTranslations } from "next-intl";
import AppStoreButton from "./AppStoreButton";

// Same storefront-agnostic App Store link as the hero.
const APP_STORE_URL = "https://apps.apple.com/app/id6794851597";

/** Closing call-to-action before the footer — same button style as the hero. */
export default function FinalCTA() {
  const t = useTranslations("CTA");
  return (
    <section className="px-6 py-24 text-center">
      <div className="mx-auto max-w-2xl space-y-6">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-brand-text leading-tight">
          {t("headline")}
        </h2>
        <p className="text-lg text-brand-muted max-w-xl mx-auto leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex justify-center pt-2">
          <AppStoreButton href={APP_STORE_URL} ariaLabel={t("download")} />
        </div>
      </div>
    </section>
  );
}
