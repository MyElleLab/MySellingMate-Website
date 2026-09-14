import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import PhoneFrame from "./PhoneFrame";

// Locales for which localized screenshots exist; others fall back to English.
const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

// App pages shown, top-to-bottom, by the in-screen auto-scroll.
const PAGES = ["welcome", "result", "comparison"] as const;

/**
 * Hero device: one large, slightly 3D-tilted iPhone (Bevel-style) whose screen
 * auto-scrolls through the app's pages. The tilt sits on `.hero-device` (its
 * parent supplies the perspective); a gentle float + the scroll live in CSS and
 * switch off under reduced motion. Screenshots stay per-locale.
 */
export default function HeroPhones() {
  const t = useTranslations("AppPreview");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  // Duplicate the sequence so the leftward marquee wraps seamlessly at -50%.
  const slides = [...PAGES, ...PAGES];

  return (
    <div className="hero-device-float mx-auto w-[76vw] max-w-[300px] sm:max-w-[330px] [perspective:1800px]">
      <div className="hero-device">
        <PhoneFrame>
          <div className="hero-screen-scroll">
            {slides.map((p, i) => (
              <Image
                key={`${p}-${i}`}
                src={`/screenshots/${loc}/${p}.png`}
                alt={i === 0 ? t("promoAlt") : ""}
                aria-hidden={i !== 0}
                width={1206}
                height={2622}
                priority={i === 0}
                className="block h-full w-auto max-w-none"
              />
            ))}
          </div>
        </PhoneFrame>
      </div>
    </div>
  );
}
