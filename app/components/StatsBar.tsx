import { useTranslations } from "next-intl";

// Honest, defensible facts (the app is pre-launch, so no ratings/user counts).
// Labels come from messages/*.json (Stats.label1..4).
const stats = [
  { value: "1", key: "label1" },
  { value: "7", key: "label2" },
  { value: "∞", key: "label3" },
  { value: "100%", key: "label4" },
] as const;

export default function StatsBar() {
  const t = useTranslations("Stats");
  return (
    <section className="px-6 py-16 border-y border-brand-border">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.key} className="space-y-1">
              <div
                className="text-5xl font-bold text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--brand-accent) 0%, var(--brand-accent-dim) 100%)",
                }}
              >
                {stat.value}
              </div>
              <div className="text-sm text-brand-muted uppercase tracking-widest">{t(stat.key)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
