import React from "react";
import { Link } from "react-router-dom";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import WordTag from "@/components/site/WordTag";
import FinalCta from "@/components/site/FinalCta";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/assets";
import { VOCAB_WORDS } from "@/data/siteContent";

const CARD_PROMPTS = [
  "What does this word look like on a good day?",
  "When did you last show it without noticing?",
  "Who do you know who has it — and what do they do?",
];

const H2_STYLE = { fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 };

export default function OurMethod() {
  usePageMeta(
    "Our Method — Transformational Vocabulary | WordCompass",
    "The Transformational Vocabulary Method: curated words, card decks and the Raphael & Ella stories that give young people aged 12+ the language to change things."
  );

  return (
    <>
      <PageHero
        eyebrow="Our method"
        title="Words, made into tools."
        intro="Every session is built around a curated set of transformational vocabulary words. Each one becomes something your child can name, practise and own."
      />

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap">
          <h2 className="font-heading font-black text-charcoal" style={H2_STYLE}>
            The word list
          </h2>
          <p className="measure-wide mt-6 text-mid">
            [Full word list to come — these are the words currently in use.]
          </p>
          <ul className="mt-9 flex flex-wrap gap-3">
            {VOCAB_WORDS.map((word, index) => (
              <li key={word}>
                <WordTag tone={index % 2 === 0 ? "purple" : "sky"}>{word}</WordTag>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-warm py-16 sm:py-24">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-heading font-black text-charcoal" style={H2_STYLE}>
              A word on a card
            </h2>
            <p className="measure-wide mt-6 text-mid">
              One word per card. On the back, prompts that start a conversation rather than a lecture.
              Your mentor brings the words that fit your child's goals — and your child keeps them.
            </p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-mid">
              Sample card · [Full card set imagery to come]
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-[1.1fr_1fr] sm:items-center">
            <div className="rounded-2xl border border-black/10 bg-white p-7 shadow-[0_1px_2px_rgba(28,28,30,0.05)]">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">Word 03</p>
              <p
                className="mt-3 font-heading font-black text-charcoal"
                style={{ fontSize: "2.4rem", lineHeight: 1.1 }}
              >
                Resilience
              </p>
              <ul className="mt-6 space-y-3 border-t border-black/10 pt-6">
                {CARD_PROMPTS.map((prompt) => (
                  <li key={prompt} className="text-base text-mid">
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
            <Image
              src={IMAGES.methodCards}
              alt="A stack of printed vocabulary cards on a linen surface"
              className="h-56 w-full rounded-2xl object-cover sm:h-72"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-heading font-black text-charcoal" style={H2_STYLE}>
              The Raphael &amp; Ella stories
            </h2>
            <p className="measure-wide mt-6 text-mid">
              Raphael and Ella are two young people who keep meeting the same problems — a plateau, a
              bad week, a decision they'd rather avoid. Each story models one vocabulary word in a
              real situation, so the word has somewhere to live.
            </p>
            <p className="measure-wide mt-4 text-mid">
              Mentors read or retell a story when a word is introduced, then hand the same word to your
              child for the week ahead. You get the word too, so it can be used at home without turning
              into a lecture.
            </p>
            <Link
              to="/blog"
              className="mt-8 inline-flex font-body font-semibold text-teal underline-offset-4 hover:underline"
            >
              Read the Raphael &amp; Ella stories →
            </Link>
          </div>

          <div className="rounded-2xl border border-black/10 bg-warm p-8">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">
              How a word moves through a session
            </p>
            <ol className="mt-6 space-y-5">
              {[
                "The mentor introduces the word and what it looks like in practice.",
                "A Raphael & Ella story puts the word in a situation your child recognises.",
                "Your child names where the word is missing in their own week — and chooses one thing to try.",
              ].map((text, index) => (
                <li key={text} className="flex gap-4">
                  <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gold font-mono text-xs font-bold text-charcoal">
                    {index + 1}
                  </span>
                  <p className="text-mid">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
