"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import PhoneFrame from "./PhoneFrame";

const SHOT_LOCALES = new Set(["en", "it", "de", "es"]);

// Each step pairs a HowItWorks copy block with the screen it explains.
const STEPS = [
  { key: "step1", shot: "welcome" },
  { key: "step2", shot: "result" },
  { key: "step3", shot: "comparison" },
] as const;

/**
 * Scrollytelling "how it works": the phone is pinned while you scroll, and its
 * screen wipes from one page to the next behind a black bar (above the bar the
 * previous screen, below it the new one) — driven purely by scroll progress
 * (sticky + clip-path, no library). The left copy switches in sync. Under
 * reduced motion it degrades to a plain stacked list of steps.
 */
export default function FeatureShowcase() {
  const t = useTranslations("HowItWorks");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  const trackRef = useRef<HTMLDivElement>(null);
  const [segment, setSegment] = useState(0); // 0..STEPS.length-1
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = track.getBoundingClientRect();
      const total = track.offsetHeight - window.innerHeight; // pinned scroll span
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setSegment((scrolled / Math.max(total, 1)) * (STEPS.length - 1));
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

  const activeIndex = Math.min(Math.floor(segment), STEPS.length - 1);
  const intra = segment - activeIndex; // wipe progress: activeIndex -> activeIndex+1
  const textIndex = intra > 0.5 ? Math.min(activeIndex + 1, STEPS.length - 1) : activeIndex;

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
    <section
      id="how"
      ref={trackRef}
      className="relative scroll-mt-20"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-10 px-6">
          {/* Left: copy that switches with the active screen */}
          <div className="relative hidden min-h-[220px] flex-1 md:block">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className="feature-copy absolute inset-0 flex flex-col justify-center space-y-3"
                style={{ opacity: i === textIndex ? 1 : 0 }}
                aria-hidden={i !== textIndex}
              >
                <span className="font-mono text-brand-accent-dim">0{i + 1}</span>
                <h3 className="text-3xl font-bold text-brand-text md:text-4xl">
                  {t(`${s.key}.title`)}
                </h3>
                <p className="max-w-md text-lg text-brand-muted leading-relaxed">
                  {t(`${s.key}.description`)}
                </p>
              </div>
            ))}
          </div>

          {/* Right: pinned phone whose screen wipes between pages */}
          <div className="mx-auto w-[72vw] max-w-[300px] flex-1 md:mx-0 [container-type:inline-size]">
            <PhoneFrame>
              {STEPS.map((s, j) => {
                let clip = "inset(0 0 0 0)";
                if (j > activeIndex + 1) clip = "inset(100% 0 0 0)";
                else if (j === activeIndex + 1) clip = `inset(${(1 - intra) * 100}% 0 0 0)`;
                return (
                  <Image
                    key={s.shot}
                    src={`/screenshots/${loc}/${s.shot}.png`}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 72vw, 300px"
                    className="object-cover"
                    style={{ clipPath: clip, zIndex: j }}
                    priority={j === 0}
                  />
                );
              })}
              {intra > 0.001 && intra < 0.999 && (
                <div
                  className="feature-wipe-bar"
                  style={{ top: `${(1 - intra) * 100}%` }}
                />
              )}
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
