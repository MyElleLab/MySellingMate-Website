import { useLocale } from "next-intl";

/**
 * App Store CTA: Apple's official "Download on the App Store" badge for the
 * current locale (public/app-store-badge-<locale>.svg), used unaltered as
 * Apple's guidelines require: no recolouring, no motion, sized by height only
 * (40px minimum) with at least a quarter of its height clear around it.
 */
export default function AppStoreButton({
  href,
  ariaLabel,
}: {
  href: string;
  ariaLabel: string;
}) {
  const locale = useLocale();
  return (
    <a href={href} className="inline-flex" aria-label={ariaLabel}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/app-store-badge-${locale}.svg`}
        alt=""
        aria-hidden="true"
        className="h-12 w-auto"
      />
    </a>
  );
}
