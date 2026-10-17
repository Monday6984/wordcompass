import React from "react";
import Btn from "@/components/site/Btn";
import StepTimeline from "@/components/site/StepTimeline";
import { STEPS } from "@/data/siteContent";

export default function HowItWorksSection() {
  return (
    <section className="bg-warm py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="max-w-xl font-heading font-black text-charcoal"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          How the six free sessions work
        </h2>
        <StepTimeline steps={STEPS} />
        <div className="mt-12">
          <Btn to="/book-a-call">Book Your Free Parent Call</Btn>
        </div>
      </div>
    </section>
  );
}
