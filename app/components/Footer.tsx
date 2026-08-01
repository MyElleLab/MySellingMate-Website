import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const tc = useTranslations("Common");
  return (
    <footer className="border-t border-brand-border px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-semibold text-brand-text">{tc("appName")}</span>
            <span className="text-sm text-brand-muted">{t("tagline")}</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-muted">
            <Link href="/privacy" className="hover:text-brand-text transition-colors">{t("privacy")}</Link>
            <Link href="/terms" className="hover:text-brand-text transition-colors">{t("terms")}</Link>
            <Link href="/support" className="hover:text-brand-text transition-colors">{t("support")}</Link>
          </nav>

          <div className="text-xs text-brand-muted">
            {t("copyright", { year: new Date().getFullYear() })}
          </div>
        </div>
      </div>
    </footer>
  );
}
