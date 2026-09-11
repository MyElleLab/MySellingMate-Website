"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A code-built, realistic iPhone mockup that reveals with a 3D rotation when it
 * scrolls into view. The device frame is pure CSS (titanium gradient edge, thin
 * screen bezel, side buttons); the app screen is the localized screenshot — which
 * already includes its status bar and Dynamic Island. No image/video of a phone.
 *
 * Motion: transform + opacity only, driven by the `.phone-reveal` transition in
 * globals.css (composited, off the main thread). Plays once, reduced-motion aware.
 */
export default function AppPreviewMockup({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 } // TUNE: how much visible before it plays
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative flex justify-center py-6">
      {/* Soft brand glow behind the device. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto h-[70%] w-[60%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--brand-accent-soft), transparent)" }}
      />

      <div ref={ref} className={`phone-reveal ${inView ? "in-view" : ""}`}>
        {/* Titanium frame */}
        <div
          className="relative aspect-[1206/2622] w-[clamp(240px,62vw,300px)] rounded-[13.5%] p-[3%]"
          style={{
            background:
              "linear-gradient(150deg, #3b4048 0%, #101216 36%, #262a30 60%, #060708 100%)",
            boxShadow:
              "0 42px 80px -26px rgba(0,0,0,.75), 0 10px 26px -10px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.05)",
          }}
        >
          {/* Screen */}
          <div className="relative h-full w-full overflow-hidden rounded-[11%] bg-black">
            <Image
              src={src}
              alt={alt}
              width={1206}
              height={2622}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          {/* Side buttons (left: action + volume up/down, right: power). */}
          <span className="absolute -left-[1.5px] top-[15%] h-[4%] w-[2px] rounded-l-sm bg-neutral-500/70" />
          <span className="absolute -left-[1.5px] top-[24%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
          <span className="absolute -left-[1.5px] top-[34%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
          <span className="absolute -right-[1.5px] top-[27%] h-[10%] w-[2px] rounded-r-sm bg-neutral-500/70" />
        </div>
      </div>
    </div>
  );
}
