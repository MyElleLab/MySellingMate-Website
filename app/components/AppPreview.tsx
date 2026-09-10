import { useTranslations } from "next-intl";
import AppPreviewVideo from "./AppPreviewVideo";

// The phone showcase: a realistic iPhone mockup (rendered in Canva) rotating
// into view. The red background is chroma-keyed out and served as transparent
// video (VP9/WebM + HEVC/MP4 with alpha) — see AppPreviewVideo.
export default function AppPreview() {
  const t = useTranslations("AppPreview");
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-10 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-text">{t("title")}</h2>
          <p className="text-brand-muted max-w-xl mx-auto">{t("subtitle")}</p>
        </div>

        <AppPreviewVideo webm="/phone.webm" hevc="/phone.mp4" />
      </div>
    </section>
  );
}
