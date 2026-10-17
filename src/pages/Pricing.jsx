import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import Accordion from "@/components/site/Accordion";
import PricingSection from "@/components/home/PricingSection";
import FinalCta from "@/components/site/FinalCta";
import { FAQS } from "@/data/siteContent";

export default function Pricing() {
  usePageMeta(
    "Pricing — Six Sessions Free | WordCompass Coaching & Mentoring",
    "Your first six one-to-one sessions are free, with no obligation to continue. Continuing after week six is £X per hour, billed in blocks of six."
  );

  const freeQuestion = FAQS.find((item) => item.q === "Is it really free?");

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Start free. Decide later."
        intro="We'd rather you judge us on results than on a sales pitch — so the first six sessions cost nothing at all."
      />

      <PricingSection />

      <section className="bg-warm py-16 sm:py-24">
        <div className="wrap">
          <h2
            className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
          >
            Is it really free?
          </h2>
          {freeQuestion && (
            <div className="mt-10">
              <Accordion items={[freeQuestion]} />
            </div>
          )}
          <p className="measure-wide mt-8 text-mid">
            [Full pricing detail to come — block-of-six terms and any bursary options.]
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
