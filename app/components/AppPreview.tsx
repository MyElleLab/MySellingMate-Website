import Image from "next/image";
import { useTranslations } from "next-intl";

// Real Simulator screenshots (public/screenshots), shown as a three phone row.
// Center phone (the result screen with price + recommended marketplace) is the
// payoff, so it sits slightly larger and forward.
const shots = [
  { src: "/screenshots/welcome.png", side: true },
  { src: "/screenshots/result.png", side: false },
  { src: "/screenshots/comparison.png", side: true },
] as const;

export default function AppPreview() {
  const t = useTranslations("AppPreview");
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
          <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {shots.map((s) => (
            <div
              key={s.src}
              className={`relative rounded-[2rem] overflow-hidden border border-brand-border bg-brand-surface shadow-2xl ${
                s.side
                  ? "hidden sm:block w-[30%] max-w-[240px] opacity-90"
                  : "w-[62%] sm:w-[34%] max-w-[280px] z-10"
              }`}
            >
              <Image
                src={s.src}
                alt={t("promoAlt")}
                width={1206}
                height={2622}
                priority={!s.side}
                className="w-full h-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
