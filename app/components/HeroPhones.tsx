import { useTranslations, useLocale } from "next-intl";
import PhoneFrame from "./PhoneFrame";

// Locales for which localized screenshots exist; others fall back to English.
const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

// Three phones: welcome (enters from the left), result (centre, rises + turns),
// comparison (enters from the right). The centre one is larger and in front.
// `enter` maps to the CSS entrance keyframes in globals.css (.hero-phone--*).
const phones = [
  { name: "welcome", enter: "left", side: true },
  { name: "result", enter: "center", side: false },
  { name: "comparison", enter: "right", side: true },
] as const;

export default function HeroPhones() {
  const t = useTranslations("AppPreview");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  return (
    <div className="flex items-center justify-center gap-3 sm:gap-5 [perspective:1600px]">
      {phones.map((p) => (
        <div
          key={p.name}
          className={`hero-phone hero-phone--${p.enter} ${
            p.side
              ? "hidden sm:block w-[26%] max-w-[190px]"
              : "w-[54%] sm:w-[30%] max-w-[240px] z-10"
          }`}
        >
          <PhoneFrame
            src={`/screenshots/${loc}/${p.name}.png`}
            alt={t("promoAlt")}
            priority={!p.side}
          />
        </div>
      ))}
    </div>
  );
}
