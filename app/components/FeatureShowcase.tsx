"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import PhoneFrame from "./PhoneFrame";

const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

// Each step pairs a HowItWorks copy card with the screen it explains.
const STEPS = [
  { key: "step1", shot: "welcome" },
  { key: "step2", shot: "result" },
  { key: "step3", shot: "comparison" },
] as const;

const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

// Light card backgrounds (Bevel-like soft gradients); dark gaps between them
// become the "bar". Text is dark for contrast on the light cards.
const CARD_BG = [
  "linear-gradient(135deg, #eef1fb 0%, #e6ecf7 100%)",
  "linear-gradient(135deg, #f0ecfa 0%, #e9eefb 100%)",
  "linear-gradient(135deg, #eaf3f4 0%, #e7ecf7 100%)",
];

/**
 * "How it works" scrollytelling (Bevel-style): big light full-width cards scroll
 * up normally, with dark gaps between them. The phone is fixed on the right, on
 * top of the cards (position: sticky). As the dark gap between two cards passes
 * the phone's centre, the phone screen wipes from the leaving card's page (above
 * the bar) to the entering card's (below) — the phone's bar reads as the same
 * gap crossing it. Reduced motion degrades to a plain stacked list.
 */
export default function FeatureShowcase() {
  const t = useTranslations("HowItWorks");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [base, setBase] = useState(0);
  const [intra, setIntra] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const cards = cardsRef.current;
      const marker = window.innerHeight / 2;
      let nb = 0;
      let ni = 0;
      let done = false;
      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (marker < r.top) {
          if (i === 0) {
            nb = 0;
            ni = 0;
          } else {
            const gTop = cards[i - 1]!.getBoundingClientRect().bottom;
            const gBottom = r.top;
            nb = i - 1;
            ni = gBottom > gTop ? clamp((marker - gTop) / (gBottom - gTop), 0, 1) : 1;
          }
          done = true;
          break;
        }
        if (marker <= r.bottom) {
          nb = i;
          ni = 0;
          done = true;
          break;
        }
      }
      if (!done) {
        nb = STEPS.length - 1;
        ni = 0;
      }
      setBase(nb);
      setIntra(ni);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduce]);

  // ── Reduced motion: plain stacked steps ──
  if (reduce) {
    return (
      <section id="how" className="px-6 py-24 bg-brand-surface/30 scroll-mt-20">
        <div className="mx-auto max-w-6xl space-y-20">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
            <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
          </div>
          {STEPS.map((s, i) => (
            <div key={s.key} className="grid items-center gap-8 md:grid-cols-2">
              <div className="space-y-3">
                <span className="font-mono text-brand-accent-dim">0{i + 1}</span>
                <h3 className="text-2xl font-bold text-brand-text">{t(`${s.key}.title`)}</h3>
                <p className="text-brand-muted leading-relaxed">{t(`${s.key}.description`)}</p>
              </div>
              <div className="mx-auto w-[60vw] max-w-[240px] [container-type:inline-size]">
                <PhoneFrame src={`/screenshots/${loc}/${s.shot}.png`} alt="" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="how" className="scroll-mt-20 px-4 py-[6vh]" style={{ background: "#05070a" }}>
      <div className="relative mx-auto max-w-6xl">
        {/* Big light full-width cards, scrolling normally; dark gaps = the bar. */}
        <div className="flex flex-col gap-[2.5rem]">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="flex min-h-[86vh] flex-col justify-center rounded-[2.5rem] px-8 py-12 md:px-16"
              style={{ background: CARD_BG[i % CARD_BG.length] }}
            >
              <div className="max-w-md md:max-w-lg">
                <span className="font-mono text-sm font-semibold text-teal-700">0{i + 1}</span>
                <h3
                  className="mt-3 text-4xl font-bold leading-tight md:text-6xl"
                  style={{ color: "#111827" }}
                >
                  {t(`${s.key}.title`)}
                </h3>
                <p className="mt-4 text-lg leading-relaxed md:text-xl" style={{ color: "#4b5563" }}>
                  {t(`${s.key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Phone overlay: fixed on the right, on top of the cards. */}
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block">
          <div className="sticky top-0 flex h-screen items-center justify-center pr-2">
            <div className="w-[70%] max-w-[290px] [container-type:inline-size]">
              <PhoneFrame>
                {STEPS.map((s, j) => {
                  let clip = "inset(0 0 0 0)";
                  if (j > base + 1) clip = "inset(100% 0 0 0)";
                  else if (j === base + 1) clip = `inset(${(1 - intra) * 100}% 0 0 0)`;
                  return (
                    <Image
                      key={s.shot}
                      src={`/screenshots/${loc}/${s.shot}.png`}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 70vw, 290px"
                      className="object-cover"
                      style={{ clipPath: clip, zIndex: j }}
                      priority={j === 0}
                    />
                  );
                })}
                {intra > 0.001 && intra < 0.999 && (
                  <div className="feature-wipe-bar" style={{ top: `${(1 - intra) * 100}%` }} />
                )}
              </PhoneFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
