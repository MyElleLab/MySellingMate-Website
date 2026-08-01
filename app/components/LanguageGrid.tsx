import { useTranslations } from "next-intl";
import { routing, localeNames } from "@/i18n/routing";

// Lists supported languages by their native name. Only keep this section if
// multi-language support is a selling point for your app.
export default function LanguageGrid() {
  const t = useTranslations("Languages");
  return (
    <section className="px-6 py-16 border-t border-brand-border">
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <p className="text-sm text-brand-muted uppercase tracking-widest">{t("heading")}</p>
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 px-4 max-w-full text-brand-muted text-sm sm:text-base">
          {routing.locales.map((l) => (
            <span key={l} className="whitespace-nowrap">{localeNames[l]}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
