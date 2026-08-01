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
  const t = await getTranslations({ locale, namespace: "Metadata.terms" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/terms`,
      languages: localeAlternates("/terms"),
    },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}

function TermsContent() {
  const t = useTranslations("Terms");
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
              <p className="text-sm text-brand-muted">{t("lastUpdated")}</p>
            </header>
            <p className="text-brand-muted leading-relaxed">{t("intro")}</p>
            <p className="text-brand-muted leading-relaxed whitespace-pre-line">{t("body")}</p>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
