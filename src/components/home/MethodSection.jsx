import React from "react";
import { Link } from "react-router-dom";
import WordTag from "@/components/site/WordTag";
import { VOCAB_WORDS } from "@/data/siteContent";

const COLUMNS = [
  {
    title: "The Cards",
    body: "Physical and digital card decks. One word per card, with prompts for conversation.",
  },
  {
    title: "The Stories",
    body: "The Raphael & Ella series — short stories that model each word in real situations.",
  },
  {
    title: "The Sessions",
    body: "Your mentor uses both, tailored to your child's goals.",
  },
];

export default function MethodSection() {
  const fiveWords = VOCAB_WORDS.slice(0, 5);

  return (
    <section className="dark-gradient">
      <div className="wrap py-16 sm:py-24">
        <p className="eyebrow-light">Our method</p>
        <h2
          className="mt-4 max-w-2xl font-heading font-black text-white"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          The Transformational Vocabulary Method
        </h2>

        <div className="mt-8 max-w-[700px] space-y-5 text-white/85">
          <p>
            Every WordCompass session is built around a curated set of transformational vocabulary
            words — concepts like resilience, focus, integrity, self-respect and gratitude.
          </p>
          <p>
            These aren't abstract ideas. Each word becomes a practical tool your child can name,
            practise and own. When a young person can say "I'm in the red zone" instead of slamming a
            door, something has shifted.
          </p>
          <p>
            Our cards and stories give young people the language to describe what they're feeling —
            and the framework to change it.
          </p>
        </div>

        <ul className="mt-9 flex flex-wrap gap-3">
          {fiveWords.map((word, index) => (
            <li key={word}>
              <WordTag tone={index % 2 === 0 ? "lightPurple" : "lightSky"}>{word}</WordTag>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-heading text-xl font-bold text-white">{column.title}</h3>
              <p className="mt-3 text-white/85">{column.body}</p>
            </div>
          ))}
        </div>

        <Link
          to="/our-method"
          className="mt-12 inline-flex font-body font-semibold text-gold underline-offset-4 hover:underline"
        >
          Explore the Transformational Vocabulary Method →
        </Link>
      </div>
    </section>
  );
}
