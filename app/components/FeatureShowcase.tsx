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

/**
 * "How it works" scrollytelling: text cards scroll up normally on the left; the
 * phone stays fixed on the right (position: sticky). The dark gap between two
 * cards is the "bar" — as it passes the phone's centre, the phone screen wipes
 * from the leaving card's page (above the bar) to the entering card's page
 * (below). Driven by each card's position vs the viewport centre. Reduced motion
 * degrades to a plain stacked list.
 */
export default function FeatureShowcase() {
  const t = useTranslations("HowItWorks");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [base, setBase] = useState(0); // leaving-card index
  const [intra, setIntra] = useState(0); // 0..1 wipe across the gap after `base`
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

  // ── Reduced motion: plain stacked steps, no pin/scroll effects ──
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
    <section id="how" className="scroll-mt-20" style={{ background: "#05070a" }}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-x-10 px-6 md:grid-cols-2">
        {/* Left: cards scrolling normally, dark gaps between them = the bar */}
        <div className="flex flex-col gap-[9vh] py-[26vh]">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="flex min-h-[62vh] flex-col justify-center rounded-[2rem] border border-brand-border bg-brand-surface p-10"
            >
              <span className="font-mono text-brand-accent-dim">0{i + 1}</span>
              <h3 className="mt-3 text-3xl font-bold text-brand-text md:text-4xl">
                {t(`${s.key}.title`)}
              </h3>
              <p className="mt-3 max-w-md text-lg text-brand-muted leading-relaxed">
                {t(`${s.key}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Right: the phone stays put while the cards scroll */}
        <div className="hidden md:block">
          <div className="sticky top-0 flex h-screen items-center justify-center">
            <div className="w-[74%] max-w-[300px] [container-type:inline-size]">
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
                      sizes="(max-width: 768px) 74vw, 300px"
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
