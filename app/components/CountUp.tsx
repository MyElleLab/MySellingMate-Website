"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a stat up from 0 to its value the first time it scrolls into view.
 * Every instance uses the same duration, so a row of stats rises together and
 * lands at the same moment (proportional). Reduced motion shows the final value.
 * SSR/no-JS render the final value too (state starts at it, reset to 0 only
 * client-side while still off-screen).
 */
export default function CountUp({
  value,
  duration = 1600,
}: {
  value: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const target = parseFloat(value.replace(/[^\d.]/g, "")) || 0;
    const suffix = value.replace(/[\d.,\s]/g, "");
    const fmt = (n: number) => `${Math.round(n)}${suffix}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(fmt(target));
      return;
    }

    setDisplay(fmt(0)); // safe: stats sit below the fold, so no visible flash
    let raf = 0;
    let started = false;

    const run = () => {
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        setDisplay(fmt(target * eased));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          started = true;
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return <span ref={ref}>{display}</span>;
}
