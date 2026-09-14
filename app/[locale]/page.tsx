import { setRequestLocale } from "next-intl/server";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import StatsBar from "../components/StatsBar";
import FeatureGrid from "../components/FeatureGrid";
import LanguageGrid from "../components/LanguageGrid";
import FeatureShowcase from "../components/FeatureShowcase";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

// Section order learned from real app sites (see README, Lesson 1):
// Hero -> AppPreview (visual hook) -> Stats -> Features -> Languages -> HowItWorks -> Footer.
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <Reveal>
          <StatsBar />
        </Reveal>
        <Reveal>
          <FeatureGrid />
        </Reveal>
        <Reveal>
          <LanguageGrid />
        </Reveal>
        <FeatureShowcase />
        <Reveal>
          <FinalCTA />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
