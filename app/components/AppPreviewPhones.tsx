"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

export type Phone = {
  name: string;
  /** Side phones are hidden on mobile and sit slightly back. */
  side: boolean;
  /** Which way this phone enters the scene. */
  enter: "left" | "right" | "center";
  src: string;
  alt: string;
  priority: boolean;
};

/* ────────────────────────────────────────────────────────────────────────
   Entrance choreography. The numbers below (offset, rotation, opacity,
   duration, easing, stagger, viewport amount) are a reasonable starting
   point — they are the knobs to fine-tune later, not final values.
   ──────────────────────────────────────────────────────────────────────── */

// Per-phone from/to. Side phones slide in from their outer edge while spinning
// on themselves; the centre phone rises from below and unfolds on the Y axis.
const variants: Record<Phone["enter"], Variants> = {
  left: {
    hidden: { x: "-110%", rotate: -12, opacity: 0 }, // TUNE
    show: { x: 0, rotate: 0, opacity: 0.9 },
  },
  right: {
    hidden: { x: "110%", rotate: 12, opacity: 0 }, // TUNE
    show: { x: 0, rotate: 0, opacity: 0.9 },
  },
  center: {
    hidden: { y: "40%", rotateY: 90, opacity: 0 }, // TUNE
    show: { y: 0, rotateY: 0, opacity: 1 },
  },
};

// Container drives all three via `whileInView`; children inherit the state and
// come in staggered.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }, // TUNE stagger
};

// Shared per-phone transition (duration + easing). TUNE — could also be a spring.
const transition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const };

function boxClass(side: boolean): string {
  // Unchanged from the original AppPreview markup.
  return `relative rounded-[2rem] overflow-hidden border border-brand-border bg-brand-surface shadow-2xl ${
    side
      ? "hidden sm:block w-[30%] max-w-[240px] opacity-90"
      : "w-[62%] sm:w-[34%] max-w-[280px] z-10"
  }`;
}

function PhoneImage({ phone }: { phone: Phone }) {
  return (
    <Image
      src={phone.src}
      alt={phone.alt}
      width={1206}
      height={2622}
      priority={phone.priority}
      className="w-full h-auto"
    />
  );
}

export default function AppPreviewPhones({ phones }: { phones: Phone[] }) {
  const reduce = useReducedMotion();

  // Reduced motion: render the row exactly as before, no entrance animation.
  if (reduce) {
    return (
      <div className="flex items-center justify-center gap-4 sm:gap-6">
        {phones.map((p) => (
          <div key={p.name} className={boxClass(p.side)}>
            <PhoneImage phone={p} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center justify-center gap-4 sm:gap-6 [perspective:1200px]"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }} // TUNE: how much must be visible to fire
    >
      {phones.map((p) => (
        <motion.div
          key={p.name}
          className={boxClass(p.side)}
          variants={variants[p.enter]}
          transition={transition}
          style={{ transformStyle: "preserve-3d" }}
        >
          <PhoneImage phone={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
