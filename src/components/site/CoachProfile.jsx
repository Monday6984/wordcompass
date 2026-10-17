import React from "react";

// The full profile content on a coach's own page (/coaches/:slug).
// Name, headline and photo are shown in the page hero above it.
export default function CoachProfile({ coach }) {
  return (
    <article className="card-soft">
      <p className="measure-wide text-mid">{coach.bio}</p>

      {coach.expertise && coach.expertise.length > 0 && (
        <div className="mt-8">
          <h2 className="eyebrow">Core mentorship philosophy &amp; expertise</h2>
          <ul className="mt-5 space-y-5">
            {coach.expertise.map((item) => (
              <li key={item.title}>
                <h3 className="font-body text-base font-semibold text-charcoal">{item.title}</h3>
                <p className="measure-wide mt-1 text-mid">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {coach.connect && (
        <div className="mt-8 border-l-2 border-gold pl-4">
          <h2 className="eyebrow">Why they connect with young people</h2>
          <p className="measure-wide mt-3 font-heading text-base italic text-charcoal">
            {coach.connect}
          </p>
        </div>
      )}

      <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-mid">
        Enhanced DBS checked · Safeguarding trained · Fully insured
      </p>
    </article>
  );
}
