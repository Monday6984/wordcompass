import React from "react";
import Accordion from "@/components/site/Accordion";
import { FAQS } from "@/data/siteContent";

export default function FaqSection() {
  return (
    <section className="bg-warm py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          Questions parents ask
        </h2>

        <div className="mt-10">
          <Accordion items={FAQS} />
        </div>
      </div>
    </section>
  );
}
