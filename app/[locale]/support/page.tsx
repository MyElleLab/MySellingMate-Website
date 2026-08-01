import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localeAlternates } from "@/i18n/metadata";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.support" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/support`,
      languages: localeAlternates("/support"),
    },
  };
}

export default async function SupportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SupportContent />;
}

function SupportContent() {
  const t = useTranslations("Support");
  const tc = useTranslations("Common");
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-brand-muted hover:text-brand-accent transition-colors mb-10"
          >
            ← {tc("backHome")}
          </Link>
          <article className="space-y-6">
            <header className="space-y-2">
              <h1 className="text-4xl font-bold text-brand-text">{t("title")}</h1>
            </header>
            <p className="text-brand-muted leading-relaxed">{t("intro")}</p>

            <div className="rounded-xl bg-brand-surface border border-brand-border p-6 space-y-1">
              <p className="text-sm text-brand-muted">{t("emailLabel")}</p>
              <a
                href={`mailto:${t("email")}`}
                className="text-lg font-semibold text-brand-accent hover:underline break-all"
              >
                {t("email")}
              </a>
              <p className="text-sm text-brand-muted pt-2">{t("responseNote")}</p>
            </div>

            <section className="space-y-4 pt-4">
              <h2 className="text-xl font-semibold text-brand-text">{t("faqTitle")}</h2>
              <div className="space-y-2">
                <h3 className="font-medium text-brand-text">{t("faq1Q")}</h3>
                <p className="text-brand-muted leading-relaxed">{t("faq1A")}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-brand-text">{t("faq2Q")}</h3>
                <p className="text-brand-muted leading-relaxed">{t("faq2A")}</p>
              </div>
            </section>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
