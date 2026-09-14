import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A realistic iPhone mockup built entirely in CSS: titanium gradient edge, thin
 * screen bezel, side buttons. Width is controlled by the parent (renders at
 * w-full of its container).
 *
 * The screen shows either a single `src` screenshot (object-cover) or, when
 * `children` are given, arbitrary content clipped to the rounded screen — used
 * for the hero's scrolling column of app pages.
 */
export default function PhoneFrame({
  src,
  alt = "",
  priority = false,
  children,
}: {
  src?: string;
  alt?: string;
  priority?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      className="relative aspect-[1206/2622] w-full rounded-[16cqw] p-[3%]"
      style={{
        background:
          "linear-gradient(150deg, #3b4048 0%, #101216 36%, #262a30 60%, #060708 100%)",
        boxShadow:
          "0 42px 80px -26px rgba(0,0,0,.75), 0 10px 26px -10px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.16), inset 0 0 0 1px rgba(255,255,255,.05)",
      }}
    >
      {/* Screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[13cqw] bg-black">
        {children ??
          (src ? (
            <Image
              src={src}
              alt={alt}
              width={1206}
              height={2622}
              className="h-full w-full object-cover"
              priority={priority}
            />
          ) : null)}
      </div>

      {/* Side buttons (left: action + volume up/down, right: power). */}
      <span className="absolute -left-[1.5px] top-[15%] h-[4%] w-[2px] rounded-l-sm bg-neutral-500/70" />
      <span className="absolute -left-[1.5px] top-[24%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
      <span className="absolute -left-[1.5px] top-[34%] h-[7%] w-[2px] rounded-l-sm bg-neutral-500/70" />
      <span className="absolute -right-[1.5px] top-[27%] h-[10%] w-[2px] rounded-r-sm bg-neutral-500/70" />
    </div>
  );
}
