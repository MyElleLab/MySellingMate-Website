import { useTranslations } from "next-intl";

const steps = [
  { number: "01", key: "step1" },
  { number: "02", key: "step2" },
  { number: "03", key: "step3" },
] as const;

export default function HowItWorks() {
  const t = useTranslations("HowItWorks");
  return (
    <section id="how" className="px-6 py-24 bg-brand-surface/30 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
          <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.key} className="relative flex flex-col items-center text-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center">
                <span className="text-xl font-mono text-brand-accent-dim">{step.number}</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-brand-text">{t(`${step.key}.title`)}</h3>
                <p className="text-sm text-brand-muted leading-relaxed max-w-xs mx-auto">
                  {t(`${step.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
