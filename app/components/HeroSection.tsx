import { useTranslations } from "next-intl";
import HeroPhones from "./HeroPhones";
import AppStoreButton from "./AppStoreButton";

// Storefront-agnostic App Store link: no country segment, so Apple redirects to
// the visitor's own storefront (/it/, /de/, /es/, ...). A pinned form like
// /us/app/id... would send every locale to the US store.
const APP_STORE_URL = "https://apps.apple.com/app/id6794851597";

export default function HeroSection() {
  const t = useTranslations("Hero");
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-start px-6 pt-24 md:pt-28 pb-16 overflow-hidden">
      {/* Animated aurora backdrop: soft brand-tinted glows drifting behind the
          content (Bevel-style, but in the app's dark/teal palette, pure CSS). */}
      <div className="hero-aurora" aria-hidden="true">
        <span className="hero-aurora-blob hero-aurora-blob--1" />
        <span className="hero-aurora-blob hero-aurora-blob--2" />
        <span className="hero-aurora-blob hero-aurora-blob--3" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-brand-text leading-[1.1]">
          <span className="block">{t("headlineLine1")}</span>
          <span
            className="block text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-accent-dim) 100%)",
            }}
          >
            {t("headlineLine2")}
          </span>
        </h1>

        {/* The device sits right under the title — the first thing you see. */}
        <HeroPhones />

        <div className="flex flex-col items-center gap-2 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          <p className="text-brand-muted">{t("sub1")}</p>
          <p className="text-brand-text font-bold">{t("sub2")}</p>
          <p className="text-brand-accent">{t("sub3")}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AppStoreButton
            href={APP_STORE_URL}
            label={t("cta")}
            ariaLabel={t("ctaAria")}
          />
          <a href="#features" className="text-sm text-brand-muted hover:text-brand-text transition-colors">
            {t("seeFeatures")} ↓
          </a>
        </div>
      </div>
    </section>
  );
}
