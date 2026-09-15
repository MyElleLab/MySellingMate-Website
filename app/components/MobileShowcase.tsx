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

/**
 * Mobile "how it works": a pinned phone + a text block, both driven by scroll.
 * As you scroll the section, the phone screen wipes to the next page and the
 * copy cross-fades in sync — the desktop effect, adapted (phone + text only, no
 * cards). Reduced motion falls back to a plain stacked list.
 */
export default function MobileShowcase() {
  const t = useTranslations("Showcase");
  const locale = useLocale();
  const loc = SHOT_LOCALES.has(locale) ? locale : "en";

  const trackRef = useRef<HTMLDivElement>(null);
  const [seg, setSeg] = useState(0); // 0..STEPS.length-1
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
      const total = track.offsetHeight - window.innerHeight;
      const scrolled = clamp(-rect.top, 0, Math.max(total, 1));
      setSeg((scrolled / Math.max(total, 1)) * (STEPS.length - 1));
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

  const activeIndex = Math.min(Math.floor(seg), STEPS.length - 1);
  const intra = seg - activeIndex;
  const textIndex = intra > 0.5 ? Math.min(activeIndex + 1, STEPS.length - 1) : activeIndex;

  // ── Reduced motion: plain stacked list ──
  if (reduce) {
    return (
      <div className="bg-brand-surface/30 px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-brand-text">{t("title")}</h2>
            <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
          </div>
          {STEPS.map((s, i) => (
            <div key={s.key} className="space-y-4 text-center">
              <span className="font-mono text-brand-accent-dim">0{i + 1}</span>
              <h3 className="text-2xl font-bold text-brand-text">{t(`${s.key}.title`)}</h3>
              <p className="text-brand-muted">{t(`${s.key}.description`)}</p>
              <div className="mx-auto w-[58vw] max-w-[220px] [container-type:inline-size]">
                <PhoneFrame src={`/screenshots/${loc}/showcase/${s.shot}.jpg`} alt="" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={trackRef} className="relative bg-brand-surface/30" style={{ height: `${STEPS.length * 78}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-7 px-6">
        {/* Copy — cross-fades with the screen */}
        <div className="relative h-[168px] w-full max-w-sm">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className="absolute inset-0 flex flex-col items-center justify-center text-center transition-opacity duration-300"
              style={{ opacity: i === textIndex ? 1 : 0 }}
              aria-hidden={i !== textIndex}
            >
              <span className="font-mono text-sm text-brand-accent-dim">0{i + 1}</span>
              <h3 className="mt-1 text-2xl font-bold text-brand-text">{t(`${s.key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{t(`${s.key}.description`)}</p>
            </div>
          ))}
        </div>

        {/* Phone with the scroll-driven screen wipe */}
        <div className="w-[60vw] max-w-[230px] [container-type:inline-size]">
          <div
            className="relative aspect-[1206/2622] w-full rounded-[16cqw] p-[3%]"
            style={{
              background:
                "linear-gradient(150deg, #3b4048 0%, #101216 36%, #262a30 60%, #060708 100%)",
              boxShadow:
                "0 42px 80px -26px rgba(0,0,0,.75), 0 10px 26px -10px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.05)",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[13cqw] bg-black">
              {STEPS.map((s, j) => {
                let clip = "inset(100% 0 0 0)";
                if (j <= activeIndex) clip = "inset(0 0 0 0)";
                else if (j === activeIndex + 1) clip = `inset(${(1 - intra) * 100}% 0 0 0)`;
                return (
                  <Image
                    key={s.shot}
                    src={`/screenshots/${loc}/showcase/${s.shot}.jpg`}
                    alt=""
                    fill
                    sizes="230px"
                    className="object-cover"
                    style={{ clipPath: clip, zIndex: j }}
                  />
                );
              })}
              {intra > 0.001 && intra < 0.999 && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: `${(1 - intra) * 100}%`,
                    height: "1.75rem",
                    transform: "translateY(-50%)",
                    background: "#05070a",
                    zIndex: 60,
                  }}
                />
              )}
            </div>

            <span className="absolute -left-[1.5px] top-[15%] h-[4%] w-[2px] rounded-l-sm bg-neutral-500/70" />
            <span className="absolute -left-[1.5px] top-[24%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
            <span className="absolute -left-[1.5px] top-[34%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
            <span className="absolute -right-[1.5px] top-[27%] h-[10%] w-[2px] rounded-r-sm bg-neutral-500/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
