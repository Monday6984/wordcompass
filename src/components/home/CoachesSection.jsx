import React from "react";
import { Link } from "react-router-dom";
import CoachCard from "@/components/site/CoachCard";
import CheckList from "@/components/site/CheckList";
import { COACHES } from "@/data/coaches";
import { COACH_CHECKS } from "@/data/siteContent";

export default function CoachesSection() {
  const featured = COACHES.filter((coach) => coach.featured);

  return (
    <section className="bg-cream py-16 sm:py-24">
      <div className="wrap">
        <h2
          className="font-heading font-black text-charcoal"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
        >
          Mind mentors, not tutors
        </h2>

        <div className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">
            Every coach is
          </p>
          <CheckList items={COACH_CHECKS} className="mt-5" />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {featured.map((coach) => (
            <CoachCard key={coach.name} coach={coach} />
          ))}
        </div>

        <Link
          to="/coaches"
          className="mt-10 inline-flex font-body font-semibold text-teal underline-offset-4 hover:underline"
        >
          Meet the full team →
        </Link>
      </div>
    </section>
  );
}
