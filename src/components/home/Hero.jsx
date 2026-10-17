import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import Btn from "@/components/site/Btn";
import CheckList from "@/components/site/CheckList";
import { IMAGES } from "@/data/assets";
import { HERO_TICKS } from "@/data/siteContent";

export default function Hero() {
  return (
    <section className="bg-cream py-12 sm:py-16 lg:py-20">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow">Words that help young people find their way</p>
          <h1
            className="mt-5 font-heading font-black text-charcoal"
            style={{
              fontSize: "clamp(2.6rem, 4.5vw, 4rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
            }}
          >
            Sometimes the right words need to come from someone else.
          </h1>
          <p className="measure mt-6 text-lg leading-[1.7] text-mid">
            WordCompass pairs young people aged 12+ with DBS-checked mind mentors for six free
            one-to-one sessions — building confidence, focus and self-belief in sport, study and life.
          </p>
          <CheckList items={HERO_TICKS} className="mt-8" />
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Btn to="/book-a-call" variant="gold">
              Book a Free Parent Call
            </Btn>
            <Link
              to="/how-it-works"
              className="font-body font-semibold text-teal underline-offset-4 hover:underline"
            >
              See how it works →
            </Link>
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-mid">
            20-minute call. No sales pitch. Just a conversation about your child.
          </p>
        </div>

        <Image
          src={IMAGES.hero}
          alt="A mentor and a teenager talking quietly side by side at a table by a window"
          loading="eager"
          fetchpriority="high"
          className="h-72 w-full rounded-2xl object-cover sm:h-96 lg:h-[32rem]"
        />
      </div>
    </section>
  );
}
