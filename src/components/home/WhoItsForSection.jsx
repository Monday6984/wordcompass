import React from "react";
import { Link } from "react-router-dom";
import { ESPECIALLY_FOR } from "@/data/siteContent";

export default function WhoItsForSection() {
  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          Who we work with
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <article className="card-soft flex h-full flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">
              The client
            </p>
            <h3 className="mt-3 font-heading text-2xl font-bold text-charcoal">
              Parents — You are the client.
            </h3>
            <p className="measure-wide mt-4 text-mid">
              We work with you, not around you. You'll receive a short update after each session, and
              your coach will share the tools being used so you can reinforce them at home.
            </p>
            <Link
              to="/for-parents"
              className="mt-6 font-body font-semibold text-teal underline-offset-4 hover:underline"
            >
              Learn more →
            </Link>
          </article>

          <article className="card-soft flex h-full flex-col">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">
              The sessions
            </p>
            <h3 className="mt-3 font-heading text-2xl font-bold text-charcoal">
              Young People (12+) — Your child leads.
            </h3>
            <p className="measure-wide mt-4 text-mid">
              Sessions are theirs. Their goals, their pace, their space. We don't report back on
              everything they say — we report on progress and themes.
            </p>
            <Link
              to="/for-young-people"
              className="mt-6 font-body font-semibold text-teal underline-offset-4 hover:underline"
            >
              Learn more →
            </Link>
          </article>
        </div>

        <div className="mt-12 rounded-2xl border border-black/5 bg-white/70 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">
            Especially effective for
          </p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {ESPECIALLY_FOR.map((item) => (
              <li
                key={item}
                className="rounded-full border border-teal/30 bg-teal/8 px-5 py-2.5 text-base text-charcoal"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
