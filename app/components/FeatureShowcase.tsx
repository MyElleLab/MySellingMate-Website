"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import PhoneFrame from "./PhoneFrame";

const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

const STEPS = [
  { key: "scan", shot: "scan" },
  { key: "history", shot: "history" },
  { key: "settings", shot: "settings" },
  { key: "result", shot: "result" },
] as const;

const clamp = (n: number, a: number, b: number) => Math.min(Math.max(n, a), b);

const CARD_BG = [
  "linear-gradient(135deg, #eef1fb 0%, #e6ecf7 100%)",
  "linear-gradient(135deg, #f0ecfa 0%, #e9eefb 100%)",
  "linear-gradient(135deg, #eaf3f4 0%, #e7ecf7 100%)",
];

const GAP = "3.5rem"; // dark space between cards === the bar that crosses the phone

/**
 * "How it works":
 * - Desktop (md+, no reduced motion): a Bevel-style scrollytelling — light cards
 *   scroll behind a fixed phone whose screen wipes at the dark gap between cards.
 * - Mobile (and reduced motion): a plain stacked layout (text + a static
 *   screenshot per step). The heavy sticky/wipe effect is dropped there.
 * The desktop path is unchanged; the mobile path is a separate, CSS-gated tree.
 */
export default function FeatureShowcase() {
  const t = useTranslations("Showcase");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const [base, setBase] = useState(0);
  const [split, setSplit] = useState(0); // 0..1 across the screen (bar position)
  const [barTop, setBarTop] = useState(0); // px within the phone wrapper
  const [barOn, setBarOn] = useState(false);
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
      const wrap = wrapRef.current?.getBoundingClientRect();
      const scr = screenRef.current?.getBoundingClientRect();
      if (!wrap || !scr || scr.height === 0) return; // hidden on mobile → skip

      let completed = 0;
      let active = -1;
      let gapC = 0;
      for (let i = 0; i < cards.length - 1; i++) {
        const a = cards[i]?.getBoundingClientRect();
        const b = cards[i + 1]?.getBoundingClientRect();
        if (!a || !b) continue;
        const gc = (a.bottom + b.top) / 2; // gap centre, viewport coords
        if (gc <= scr.top) completed++;
        else if (gc < scr.bottom && active < 0) {
          active = i;
          gapC = gc;
        }
      }

      if (active >= 0) {
        setBase(active);
        setBarOn(true);
        setSplit(clamp((gapC - scr.top) / scr.height, 0, 1));
        setBarTop(gapC - wrap.top);
      } else {
        setBase(completed);
        setBarOn(false);
      }
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

  // Simple stacked layout — mobile and reduced motion.
  const simpleInner = (
    <div className="mx-auto max-w-6xl space-y-14 md:space-y-20">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
        <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
      </div>
      {STEPS.map((s, i) => (
        <div key={s.key} className="grid items-center gap-6 md:gap-8 md:grid-cols-2">
          <div className="space-y-3 text-center md:text-left">
            <span className="font-mono text-brand-accent-dim">0{i + 1}</span>
            <h3 className="text-2xl font-bold text-brand-text">{t(`${s.key}.title`)}</h3>
            <p className="text-brand-muted leading-relaxed">{t(`${s.key}.description`)}</p>
          </div>
          <div className="mx-auto w-[58vw] max-w-[220px] [container-type:inline-size]">
            <PhoneFrame src={`/screenshots/${loc}/showcase/${s.shot}.jpg`} alt="" />
          </div>
        </div>
      ))}
    </div>
  );

  // Desktop scrollytelling (unchanged).
  const scrollyInner = (
    <div className="relative mx-auto max-w-6xl">
      {/* Big light full-width cards — scroll up normally, BEHIND the phone. */}
      <div className="flex flex-col" style={{ gap: GAP }}>
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className="flex min-h-[88vh] flex-col justify-center rounded-[2.5rem] px-8 py-12 md:px-16"
            style={{ background: CARD_BG[i % CARD_BG.length] }}
          >
            <div className="max-w-md md:max-w-lg">
              <span className="font-mono text-sm font-semibold text-teal-700">0{i + 1}</span>
              <h3 className="mt-3 text-4xl font-bold leading-tight md:text-6xl" style={{ color: "#111827" }}>
                {t(`${s.key}.title`)}
              </h3>
              <p className="mt-4 text-lg leading-relaxed md:text-xl" style={{ color: "#4b5563" }}>
                {t(`${s.key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Fixed phone on the right, ON TOP of the cards. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 md:block">
        <div className="sticky top-0 flex h-screen items-center justify-center pr-2">
          <div className="w-[70%] max-w-[290px] [container-type:inline-size]">
            <div
              ref={wrapRef}
              className="relative aspect-[1206/2622] w-full rounded-[16cqw] p-[3%]"
              style={{
                background:
                  "linear-gradient(150deg, #3b4048 0%, #101216 36%, #262a30 60%, #060708 100%)",
                boxShadow:
                  "0 42px 80px -26px rgba(0,0,0,.75), 0 10px 26px -10px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.05)",
              }}
            >
              <div
                ref={screenRef}
                className="relative h-full w-full overflow-hidden rounded-[13cqw] bg-black"
              >
                {STEPS.map((s, j) => {
                  let clip = "inset(100% 0 0 0)"; // hidden
                  if (j <= base) clip = "inset(0 0 0 0)";
                  else if (j === base + 1 && barOn) clip = `inset(${split * 100}% 0 0 0)`;
                  return (
                    <Image
                      key={s.shot}
                      src={`/screenshots/${loc}/showcase/${s.shot}.jpg`}
                      alt=""
                      fill
                      sizes="290px"
                      className="object-cover"
                      style={{ clipPath: clip, zIndex: j }}
                    />
                  );
                })}
              </div>

              {/* Side buttons */}
              <span className="absolute -left-[1.5px] top-[15%] h-[4%] w-[2px] rounded-l-sm bg-neutral-500/70" />
              <span className="absolute -left-[1.5px] top-[24%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
              <span className="absolute -left-[1.5px] top-[34%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
              <span className="absolute -right-[1.5px] top-[27%] h-[10%] w-[2px] rounded-r-sm bg-neutral-500/70" />

              {/* The card gap, redrawn OVER the whole phone at its real Y. */}
              {barOn && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: barTop,
                    height: GAP,
                    transform: "translateY(-50%)",
                    background: "#05070a",
                    zIndex: 60,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="how" className="scroll-mt-20">
      {/* Mobile: simple stacked layout, no phone-wipe */}
      <div className="md:hidden bg-brand-surface/30 px-6 py-16">{simpleInner}</div>

      {/* Desktop: scrollytelling, or simple layout under reduced motion */}
      <div className="hidden md:block">
        {reduce ? (
          <div className="bg-brand-surface/30 px-6 py-24">{simpleInner}</div>
        ) : (
          <div className="px-4 py-[6vh]" style={{ background: "#05070a" }}>
            {scrollyInner}
          </div>
        )}
      </div>
    </section>
  );
}
