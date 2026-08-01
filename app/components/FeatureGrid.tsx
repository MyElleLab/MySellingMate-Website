import { useTranslations } from "next-intl";

// Six placeholder feature cards. Swap the generic icons for ones that fit your
// app, and fill titles/descriptions in messages/*.json (Features.f1..f6).
const features = [
  { id: "f1", icon: <BoltIcon /> },
  { id: "f2", icon: <ChartIcon /> },
  { id: "f3", icon: <LockIcon /> },
  { id: "f4", icon: <BellIcon /> },
  { id: "f5", icon: <GlobeIcon /> },
  { id: "f6", icon: <SparkleIcon /> },
] as const;

export default function FeatureGrid() {
  const t = useTranslations("Features");
  return (
    <section id="features" className="px-6 py-24 scroll-mt-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
          <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.id}
              className="group relative p-6 rounded-xl bg-brand-surface border border-brand-border hover:border-brand-accent-dim transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="mb-4 text-brand-accent">{f.icon}</div>
              <h3 className="font-semibold text-brand-text mb-2">{t(`${f.id}.title`)}</h3>
              <p className="text-sm text-brand-muted leading-relaxed">{t(`${f.id}.description`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Generic line icons (currentColor = brand-accent). Replace as needed. */
const S = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
function BoltIcon() { return <svg {...S}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" /></svg>; }
function ChartIcon() { return <svg {...S}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>; }
function LockIcon() { return <svg {...S}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>; }
function BellIcon() { return <svg {...S}><path d="M6 11a6 6 0 0 1 12 0v4l2 3H4l2-3v-4z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>; }
function GlobeIcon() { return <svg {...S}><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18" /></svg>; }
function SparkleIcon() { return <svg {...S}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" /></svg>; }
