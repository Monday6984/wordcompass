import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import FinalCta from "@/components/site/FinalCta";
import { IMAGES } from "@/data/assets";
import { SESSION_SHAPE } from "@/data/siteContent";

export default function ForYoungPeople() {
  usePageMeta(
    "For Young People — Your Goals, Your Pace, Your Space | WordCompass",
    "If you're 12 or over and things feel stuck, coaching is a space that's yours. Six free one-to-one online sessions with a DBS-checked mentor."
  );

  return (
    <>
      <PageHero
        eyebrow="For young people aged 12+"
        title="Your goals. Your pace. Your space."
        intro="Six free sessions, one hour a week, online. No one makes you talk about anything you don't want to talk about."
        image={IMAGES.thoughtfulTeen}
        imageAlt="A teenager sitting by a window, thinking quietly"
      />

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                What it's actually for
              </h2>
              <p className="measure-wide mt-4 text-mid">
                Maybe training has gone flat. Maybe school feels like a wall. Maybe everything is
                fine on paper and you still can't get started. Coaching is a weekly hour to work on
                whatever is in the way — sport, study, confidence, or something you haven't told
                anyone yet.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">What a session feels like</h2>
              <p className="measure-wide mt-4 text-mid">
                It's a conversation, not a lesson and not a telling-off. Your mentor asks what you want
                to change, you work out the next small step together, and you leave with something
                specific to try that week.
              </p>
              <ul className="mt-6 space-y-3">
                {SESSION_SHAPE.map((part) => (
                  <li key={part.title} className="measure-wide rounded-xl border border-black/10 bg-white/70 px-5 py-4">
                    <span className="font-heading font-bold text-charcoal">{part.title}</span>
                    <span className="text-mid"> — {part.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-10">
            <div className="card-warm">
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                Confidentiality, in plain words
              </h2>
              <p className="measure-wide mt-4 text-mid">
                What you say in a session stays in the session. We don't repeat it back to your parents.
              </p>
              <p className="measure-wide mt-4 text-mid">
                The one exception is safety. If we think you or someone else is at risk of being hurt,
                we have to tell someone who can help — and we'll always tell you first that we're going
                to do that.
              </p>
              <p className="measure-wide mt-4 text-mid">
                Your mentor is a mentor, not a therapist or a doctor. That means you can talk honestly
                without it becoming a medical thing.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                What we ask of you
              </h2>
              <p className="measure-wide mt-4 text-mid">
                Turn up, roughly on time, in a room where you can talk. Bring the thing that's bugging
                you. That's it. If after a session or two it isn't for you, you can stop — no one will
                chase you about it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
