import React from "react";
import { Link } from "react-router-dom";
import CoachAvatar, { firstName } from "./CoachAvatar";

// Coach summary card (homepage and /coaches). The whole card is clickable through a
// "stretched" link, so keyboard and screen-reader users meet just one link per card.
export default function CoachCard({ coach }) {
  return (
    <article className="card-soft relative flex h-full flex-col transition-colors duration-200 focus-within:border-teal-light hover:border-teal/30">
      <CoachAvatar coach={coach} className="h-20 w-20" textClassName="text-2xl" />
      <h3 className="mt-6 font-heading text-xl font-bold text-charcoal">{coach.name}</h3>
      {coach.headline && (
        <p className="mt-1 font-body text-sm font-semibold text-teal">{coach.headline}</p>
      )}
      <p className="mt-3 text-base text-mid">{coach.shortBio}</p>
      <p className="mt-auto pt-6">
        <Link
          to={`/coaches/${coach.slug}`}
          className="font-body font-semibold text-teal underline-offset-4 after:absolute after:inset-0 after:rounded-2xl after:content-[''] hover:underline"
        >
          Read {firstName(coach)}'s full profile →
        </Link>
      </p>
    </article>
  );
}
