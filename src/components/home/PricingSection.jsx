import React from "react";
import Btn from "@/components/site/Btn";
import CheckList from "@/components/site/CheckList";
import { FREE_INCLUDES } from "@/data/siteContent";

export default function PricingSection() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          Start free. Decide later.
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="card-soft">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">
              The first six sessions
            </p>
            <p className="mt-3 font-heading text-4xl font-black text-charcoal">Free</p>
            <CheckList items={FREE_INCLUDES} className="mt-7" />
          </div>

          <div className="card-soft flex flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">
              Continuing after week six
            </p>
            <p className="mt-5 text-lg leading-[1.7] text-mid">
              If you choose to continue, sessions are £X per hour, billed in blocks of six. We'll
              discuss this at your review — never before.
            </p>
            <div className="mt-8">
              <Btn to="/book-a-call">Book Your Free Parent Call</Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
