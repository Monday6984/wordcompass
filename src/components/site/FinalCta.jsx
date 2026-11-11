import React from "react";
import Btn from "./Btn";

export default function FinalCta({
  heading = "Start with one conversation.",
  body = "Book a free 20-minute call and tell us about your child. We'll tell you whether we can help.",
  microCopy = "There's no obligation and no sales pitch.",
}) {
  return (
    <section className="dark-gradient">
      <div className="wrap py-20 text-center sm:py-24">
        <h2
          className="mx-auto max-w-2xl font-heading font-black text-white"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          {heading}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/85 sm:text-lg">{body}</p>
        <div className="mt-9 flex justify-center">
          <Btn to="/book-a-call" variant="gold">
            Book Your Free Parent Call
          </Btn>
        </div>
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-white/70">
          {microCopy}
        </p>
      </div>
    </section>
  );
}
