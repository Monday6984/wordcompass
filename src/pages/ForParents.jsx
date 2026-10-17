import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import CheckList from "@/components/site/CheckList";
import FinalCta from "@/components/site/FinalCta";
import { IMAGES } from "@/data/assets";
import { AFTER_SIX_WEEKS, DURING_SIX_WEEKS } from "@/data/siteContent";

export default function ForParents() {
  usePageMeta(
    "For Parents — Coaching for Young People Aged 12+ | WordCompass",
    "You are the client: updates after every session, the tools we use, and a full review at week six. Free one-to-one coaching for young people aged 12+, online UK-wide."
  );

  return (
    <>
      <PageHero
        eyebrow="For parents"
        title="You are the client."
        intro="We work with you, not around you. You'll know what's being worked on, and what you can do at home to reinforce it."
        image={IMAGES.hero}
        imageAlt="A mentor and a teenager talking quietly side by side at a table"
      />

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-heading text-2xl font-bold text-charcoal">What you get</h2>
            <CheckList items={DURING_SIX_WEEKS} className="mt-6" />
            <h2 className="mt-12 font-heading text-2xl font-bold text-charcoal">
              After the six weeks
            </h2>
            <CheckList items={AFTER_SIX_WEEKS} className="mt-6" />
          </div>

          <div className="space-y-10">
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">How we communicate</h2>
              <p className="measure-wide mt-4 text-mid">
                You'll get a short written update after every session, plus the vocabulary word being
                worked on that week and simple prompts to use at home. If something needs a bigger
                conversation, we'll arrange a call rather than leave it in writing.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                Your role between sessions
              </h2>
              <p className="measure-wide mt-4 text-mid">
                Parents are the most important influence in a young person's life — that never changes.
                Your job between sessions isn't to police anything. It's to notice, and to use the same
                words we're using. We'll show you how.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-charcoal">
                Boundaries and confidentiality — honestly
              </h2>
              <p className="measure-wide mt-4 text-mid">
                Sessions belong to your child, and we don't report private disclosures back to you.
                What we do share is themes, progress, and anything safeguarding-related — immediately,
                every time. If we ever think your child needs clinical support, we'll say so plainly
                and help you find it.
              </p>
              <p className="measure-wide mt-4 text-mid">
                Sessions happen on an agreed platform, with no one-to-one contact outside them, and we
                require your written consent before session one.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
