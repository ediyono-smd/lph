import React from "react";
import { PublicNavbar, PublicFooter } from "@/components/public/public-nav";
import { WarmHeroSection } from "@/components/warm/hero-section";
import { SlaTimingGrid } from "@/components/warm/sla-timing-grid";
import { VisionMissionSection } from "@/components/warm/vision-mission-section";
import { WarmEventsSection } from "@/components/warm/events-section";
import { WarmScholarsSection } from "@/components/warm/scholars-section";
import { WarmSubsidyGoalBanner } from "@/components/warm/subsidy-goal-banner";
import { WarmNewsSection } from "@/components/warm/news-section";
import { WarmNewsletterCta } from "@/components/warm/newsletter-cta";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf6] text-slate-900 selection:bg-[#f3cf8c] selection:text-slate-950 font-sans">
      {/* 1. Header & Navigation */}
      <PublicNavbar />

      <main className="flex-1 space-y-4">
        {/* 2. Light Airy Hero Section */}
        <WarmHeroSection />

        {/* 3. SLA Timing Grid (6 Cards) */}
        <SlaTimingGrid />

        {/* 4. Vision, Mission & 4 SJPH Pastel Pillars (With Islamic Geometric Watermark) */}
        <VisionMissionSection />

        {/* 5. Events & Featured Agenda */}
        <WarmEventsSection />

        {/* 6. Scholars / Komite Fatwa Team Grid */}
        <WarmScholarsSection />

        {/* 7. Quota Subsidy Goal Progress Bar Banner (Deep Pine Green) */}
        <WarmSubsidyGoalBanner />

        {/* 8. Recent Publications & Regulatory News (3 Blog Cards) */}
        <WarmNewsSection />

        {/* 9. Newsletter Subscription Section */}
        <WarmNewsletterCta />
      </main>

      {/* 10. Deep Pine Green Footer */}
      <PublicFooter />
    </div>
  );
}
