import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/data/assets";
import { HERO_TICKS, SITE } from "@/data/siteContent";

// Homepage hero. Small teal text uses teal-dark (#0f6457, 6.6:1 on cream) because the
// primary teal (#1a9482, 3.5:1) only passes contrast at large sizes, like the headline.
export default function Hero() {
  return (
    <section className="bg-cream py-12 sm:py-16 lg:py-20 xl:py-24">
      <div className="wrap grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-12 xl:gap-14">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-teal-dark sm:text-[0.8125rem]">
            {SITE.strapline}
          </p>

          {/* Desktop keeps the designed line breaks; smaller screens wrap naturally. */}
          <h1
            className="mt-5 font-heading font-black text-charcoal text-[clamp(2.5rem,1.6rem+3.2vw,3.25rem)] lg:text-[clamp(3rem,5vw-0.1rem,3.5rem)]"
            style={{ lineHeight: 1.05, letterSpacing: "-0.025em" }}
          >
            Sometimes the <br className="hidden lg:block" />
            right words need to <br className="hidden lg:block" />
            come from{" "}
            <span className="whitespace-nowrap text-teal lg:block">
              someone else<span className="text-gold">.</span>
            </span>
          </h1>

          <p className="mt-6 max-w-[34rem] font-body text-[1.0625rem] leading-[1.7] text-mid sm:text-lg">
            WordCompass pairs young people aged 12+ with DBS-checked mind mentors for six free
            one-to-one sessions — building confidence, focus and self-belief in sport, study and life.
          </p>

          <ul className="mt-7 space-y-3.5">
            {HERO_TICKS.map((item) => (
              <li key={item} className="flex items-center gap-3.5 font-body text-base text-charcoal/90 sm:text-[1.0625rem]">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal/12" aria-hidden="true">
                  <Check className="h-4 w-4 text-teal-dark" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col items-stretch gap-x-6 gap-y-5 sm:flex-row sm:flex-wrap sm:items-center xl:gap-x-8">
            <Link
              to="/book-a-call"
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2.5 rounded-full bg-gold px-6 py-3.5 font-body text-base font-semibold text-charcoal transition-colors duration-200 hover:bg-teal-light active:bg-teal-light/80 motion-safe:active:translate-y-px sm:w-auto sm:px-8 sm:text-lg lg:px-7 lg:text-base xl:px-8 xl:text-lg"
            >
              Book a Free Parent Call
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/how-it-works"
              className="group inline-flex min-h-[2.75rem] items-center gap-2 self-start border-b-2 border-teal-dark/40 font-body text-base font-semibold text-teal-dark transition-colors duration-200 hover:border-teal-dark sm:self-auto sm:text-lg lg:text-base xl:text-lg"
            >
              See how it works
              <ArrowRight
                className="h-5 w-5 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <p className="mt-6 max-w-[32rem] font-mono text-xs uppercase leading-[1.7] tracking-[0.12em] text-mid">
            20-minute call. No sales pitch. Just a conversation about your child.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl bg-warm aspect-[5/4] sm:aspect-[16/10] lg:aspect-[4/5]">
          <Image
            src={IMAGES.hero}
            alt="A mentor and a teenager in conversation at a table by a sunlit window"
            loading="eager"
            fetchpriority="high"
            width={1600}
            height={1280}
            className="h-full w-full object-cover object-[50%_40%]"
          />
        </div>
      </div>
    </section>
  );
}
