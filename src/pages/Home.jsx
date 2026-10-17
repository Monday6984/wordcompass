import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ProblemSection from "@/components/home/ProblemSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import WhoItsForSection from "@/components/home/WhoItsForSection";
import DifferentVoiceSection from "@/components/home/DifferentVoiceSection";
import MethodSection from "@/components/home/MethodSection";
import CoachesSection from "@/components/home/CoachesSection";
import WhatYouReceiveSection from "@/components/home/WhatYouReceiveSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PricingSection from "@/components/home/PricingSection";
import LatestStoriesSection from "@/components/home/LatestStoriesSection";
import FaqSection from "@/components/home/FaqSection";
import FinalCta from "@/components/site/FinalCta";

export default function Home() {
  usePageMeta(
    "Free Life Coaching for Young People Aged 12+ | WordCompass Coaching & Mentoring",
    "Free one-to-one life coaching for young people aged 12+. DBS-checked mind mentors, online UK-wide. Six sessions free, no obligation. Book a parent call."
  );

  return (
    <>
      <Hero />
      <TrustBar />
      <ProblemSection />
      <HowItWorksSection />
      <WhoItsForSection />
      <DifferentVoiceSection />
      <MethodSection />
      <CoachesSection />
      <WhatYouReceiveSection />
      <TestimonialsSection />
      <PricingSection />
      <LatestStoriesSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
