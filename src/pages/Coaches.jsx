import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import CoachCard from "@/components/site/CoachCard";
import CheckList from "@/components/site/CheckList";
import FinalCta from "@/components/site/FinalCta";
import { IMAGES } from "@/data/assets";
import { COACHES } from "@/data/coaches";
import { COACH_CHECKS } from "@/data/siteContent";

export default function Coaches() {
  usePageMeta(
    "Meet the Coaches — DBS-Checked Mind Mentors | WordCompass",
    "Meet the WordCompass mind mentors: enhanced DBS checked, fully insured, safeguarding trained and experienced with neurodivergent young people aged 12+."
  );

  const missingPhotos = COACHES.some((coach) => !coach.photo);

  return (
    <>
      <PageHero
        eyebrow="Meet the coaches"
        title="Mind mentors, not tutors."
        intro="Our mentors aren't there to teach a subject. They're there to help a young person find their own reasons, in their own words."
        image={IMAGES.onlineSession}
        imageAlt="A young person at a desk during an online mentoring session"
      />

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">Every coach is</p>
          <CheckList items={COACH_CHECKS} className="mt-5" />

          <ul className="mt-14 grid gap-8 sm:grid-cols-2">
            {COACHES.map((coach) => (
              <li key={coach.slug}>
                <CoachCard coach={coach} />
              </li>
            ))}
          </ul>

          <p className="measure-wide mt-12 text-mid">
            {missingPhotos ? "Photographs are being added and will appear here soon. " : ""}
            DBS certificate dates and training records are available on request.
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
