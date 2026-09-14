"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguagePicker from "./LanguagePicker";

export default function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const tc = useTranslations("Common");
  const [menuOpen, setMenuOpen] = useState(false);

  // At the top: a full-width bar. Once scrolled: it morphs into a floating,
  // SwiftUI-style pill. transition-all animates the shape change (max-width,
  // radius, padding, margin, background) for a fluid "bubble" morph.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // In-page anchors (#features, #how) + the Privacy route.
  const links = [
    { href: "/#features", label: t("features") },
    { href: "/#how", label: t("how") },
    { href: "/privacy", label: t("privacy") },
  ];

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
        scrolled ? "px-4" : "px-0"
      }`}
    >
      <div
        className={`relative w-full backdrop-blur-md transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
          scrolled
            ? "mt-3 max-w-3xl rounded-full border border-brand-border bg-brand-bg/70 shadow-xl shadow-black/40 backdrop-blur-xl"
            : "mt-0 max-w-full rounded-none border-b border-brand-border bg-brand-bg/90"
        }`}
      >
      <div
        className={`mx-auto flex items-center justify-between transition-all duration-500 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
          scrolled ? "max-w-3xl px-5 py-2.5" : "max-w-6xl px-6 py-4"
        }`}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-brand-text hover:text-brand-accent transition-colors"
        >
          {/* Decorative: the wordmark beside it already names the app, so alt=""
              keeps screen readers from announcing it twice. Served at 2x (56px
              source) and rounded in CSS — the source is a hard square, no alpha. */}
          <Image
            src="/app-icon-56.png"
            alt=""
            width={28}
            height={28}
            priority
            className="rounded-lg"
          />
          {tc("appName")}
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href ? "text-brand-accent" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <LanguagePicker />
        </div>

        {/* Mobile: picker + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguagePicker />
          <button
            className="flex flex-col justify-center gap-[5px] w-8 h-8 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
          >
            <span className={`block h-[2px] w-full bg-brand-text rounded transition-transform duration-200 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
            <span className={`block h-[2px] w-full bg-brand-text rounded transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] w-full bg-brand-text rounded transition-transform duration-200 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown — a floating panel below the bar, so the pill keeps its shape */}
      {menuOpen && (
        <div className="md:hidden absolute inset-x-2 top-full mt-2 rounded-2xl border border-brand-border bg-brand-bg/95 backdrop-blur-md overflow-hidden shadow-xl shadow-black/40">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-brand-muted hover:text-brand-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
      </div>
    </nav>
  );
}
