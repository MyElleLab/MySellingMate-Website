"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Transparent phone-mockup video (chroma-keyed from the Canva render).
 * - Serves VP9/WebM (alpha) to Chrome/Firefox/Edge and HEVC/MP4 (alpha) to
 *   Safari/iOS, chosen on the client so no browser gets a format it can't key.
 * - Plays once when it scrolls into view (not at page load).
 * - prefers-reduced-motion: shows the final frame, no rotation.
 */
export default function AppPreviewVideo({
  webm,
  hevc,
}: {
  webm: string;
  hevc: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  // Pick the source the current browser can actually play *with alpha*.
  useEffect(() => {
    const ua = navigator.userAgent;
    const isSafari = /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(ua);
    setSrc(isSafari ? hevc : webm);
  }, [webm, hevc]);

  // Play once on scroll-in; respect reduced motion (jump to the end frame).
  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const toEnd = () => {
        if (v.duration) v.currentTime = v.duration;
      };
      v.addEventListener("loadedmetadata", toEnd);
      return () => v.removeEventListener("loadedmetadata", toEnd);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          v.play().catch(() => {});
          io.disconnect();
        }
      },
      { threshold: 0.4 } // TUNE: how much visible before it plays
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <div className="mx-auto w-full max-w-[680px] aspect-square">
      {src && (
        <video
          ref={ref}
          src={src}
          className="h-full w-full"
          muted
          playsInline
          preload="auto" /* download early so it's buffered before it scrolls in */
        />
      )}
    </div>
  );
}
