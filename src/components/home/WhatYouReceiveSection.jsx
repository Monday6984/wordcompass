import React from "react";
import CheckList from "@/components/site/CheckList";
import { AFTER_THREE_WEEKS, DURING_THREE_WEEKS } from "@/data/siteContent";

export default function WhatYouReceiveSection() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          What you receive
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="card-warm">
            <h3 className="font-heading text-xl font-bold text-charcoal">During the three weeks</h3>
            <CheckList items={DURING_THREE_WEEKS} className="mt-6" />
          </div>
          <div className="card-warm">
            <h3 className="font-heading text-xl font-bold text-charcoal">After the three weeks</h3>
            <CheckList items={AFTER_THREE_WEEKS} className="mt-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
