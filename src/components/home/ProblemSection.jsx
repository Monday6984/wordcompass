import React from "react";

export default function ProblemSection() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <div className="mx-auto max-w-[700px] text-center">
          <h2
            className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
          >
            You've tried everything. And it's exhausting.
          </h2>
          <p className="mt-7 text-lg leading-[1.7] text-mid">
            You've had the same conversation twenty times. You've explained, encouraged, warned,
            rewarded. And still — the homework isn't done, the training isn't happening, the door is
            shut.
          </p>
          <p className="mt-5 text-lg leading-[1.7] text-mid">
            It isn't that your child doesn't care. Often, it's that the message has worn out. When a
            parent says it, it can land as nagging. When a mentor says the same thing, it can land as
            belief.
          </p>
          <p className="mt-5 text-lg leading-[1.7] text-mid">
            That's not failure. That's human. And it's exactly the gap WordCompass was built to fill.
          </p>
        </div>

        <blockquote
          className="mx-auto mt-12 max-w-2xl border-l-4 border-gold pl-6 text-left font-heading italic text-charcoal"
          style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", lineHeight: 1.3 }}
        >
          Your child doesn't need a new parent. They need a new voice.
        </blockquote>
      </div>
    </section>
  );
}
