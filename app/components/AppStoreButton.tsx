/**
 * App Store CTA styled after the Uiverse "learn-more" button (brand-adapted):
 * a teal circle + arrow that expands to fill the pill on hover. Rendered as a
 * link. All the motion lives in CSS (.appstore-btn* in globals.css).
 */
export default function AppStoreButton({
  href,
  label,
  ariaLabel,
}: {
  href: string;
  label: string;
  ariaLabel?: string;
}) {
  return (
    <a href={href} className="appstore-btn" aria-label={ariaLabel}>
      <span className="appstore-btn__circle" aria-hidden="true">
        <span className="appstore-btn__arrow" />
      </span>
      <span className="appstore-btn__text">{label}</span>
    </a>
  );
}
