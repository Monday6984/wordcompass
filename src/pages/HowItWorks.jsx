import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import StepTimeline from "@/components/site/StepTimeline";
import Btn from "@/components/site/Btn";
import FinalCta from "@/components/site/FinalCta";
import { IMAGES } from "@/data/assets";
import { SESSION_SHAPE, STEPS } from "@/data/siteContent";

export default function HowItWorks() {
  usePageMeta(
    "How It Works — Six Free Sessions | WordCompass Coaching & Mentoring",
    "How the six free WordCompass sessions work: a free parent call, a coach match, six weekly one-to-one online sessions with a DBS-checked mind mentor, then a review."
  );

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Six free sessions, one step at a time."
        intro="No contracts, no pressure, no surprises. Here's exactly what happens from the moment you book a parent call."
        image={IMAGES.onlineSession}
        imageAlt="A young person at a desk during an online mentoring session, seen from behind"
      />

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap">
          <StepTimeline steps={STEPS} showImages />
          <div className="mt-12">
            <Btn to="/book-a-call" variant="gold">
              Book Your Free Parent Call
            </Btn>
          </div>
        </div>
      </section>

      <section className="bg-warm py-16 sm:py-24">
        <div className="wrap">
          <h2
            className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
          >
            What a session looks like
          </h2>
          <p className="measure-wide mt-6 text-mid">
            Every session follows the same calm shape, so your child always knows what's coming.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {SESSION_SHAPE.map((part) => (
              <div key={part.title} className="card-soft">
                <h3 className="font-heading text-xl font-bold text-charcoal">{part.title}</h3>
                <p className="mt-3 text-mid">{part.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
