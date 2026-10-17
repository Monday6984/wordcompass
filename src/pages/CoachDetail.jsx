import React from "react";
import { Link, useParams } from "react-router-dom";
import usePageMeta from "@/hooks/usePageMeta";
import useJsonLd from "@/hooks/useJsonLd";
import PageHero from "@/components/site/PageHero";
import Btn from "@/components/site/Btn";
import CoachProfile from "@/components/site/CoachProfile";
import CoachAvatar, { firstName } from "@/components/site/CoachAvatar";
import { getAdjacentCoaches, getCoachBySlug } from "@/data/coaches";
import { SITE } from "@/data/siteContent";

const navLinkClass = "font-body font-semibold text-teal underline-offset-4 hover:underline";

function Breadcrumb({ name }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-body text-sm text-mid">
        <li>
          <Link to="/" className="text-teal underline-offset-4 hover:underline">
            Home
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li>
          <Link to="/coaches" className="text-teal underline-offset-4 hover:underline">
            Coaches
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="text-charcoal">
          {name}
        </li>
      </ol>
    </nav>
  );
}

function CoachNotFound() {
  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="wrap-narrow">
        <p className="eyebrow">Meet the coaches</p>
        <h1
          className="mt-4 font-heading font-black text-charcoal"
          style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          Coach not found
        </h1>
        <p className="measure mt-6 text-lg leading-[1.7] text-mid">
          We couldn't find that coach. The link may be mistyped, or the profile may have moved.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Btn to="/coaches">Back to the coaches</Btn>
          <Btn to="/book-a-call" variant="gold">Book a Free Parent Call</Btn>
        </div>
      </div>
    </section>
  );
}

export default function CoachDetail() {
  const { slug } = useParams();
  const coach = getCoachBySlug(slug);

  usePageMeta(
    coach ? `${coach.name} — ${coach.headline} | WordCompass` : "Coach not found | WordCompass Coaching & Mentoring",
    coach?.shortBio
  );

  useJsonLd(
    coach && {
      "@context": "https://schema.org",
      "@type": "Person",
      name: coach.name,
      jobTitle: coach.headline,
      description: coach.shortBio,
      worksFor: { "@type": "Organization", name: SITE.name },
      ...(coach.photo ? { image: new URL(coach.photo, window.location.origin).href } : {}),
    }
  );

  if (!coach) return <CoachNotFound />;

  const { previous, next } = getAdjacentCoaches(coach.slug);
  const first = firstName(coach);

  return (
    <>
      <PageHero
        breadcrumb={<Breadcrumb name={coach.name} />}
        eyebrow="Meet the coaches"
        title={coach.name}
        intro={coach.headline}
        media={
          <div className="flex justify-center lg:justify-end">
            <CoachAvatar
              coach={coach}
              loading="eager"
              className="w-40 sm:w-64 lg:w-80"
              textClassName="text-5xl sm:text-7xl"
            />
          </div>
        }
      />

      <section className="bg-cream py-16 sm:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <CoachProfile coach={coach} />

          <aside className="card-warm lg:sticky lg:top-28" aria-labelledby="coach-fit-heading">
            <h2 id="coach-fit-heading" className="font-heading text-xl font-bold leading-snug text-charcoal">
              Would {first} be a good fit for your child?
            </h2>
            <p className="mt-4 text-base text-mid">
              Book a free 20-minute parent call. We'll talk through your child's needs and match them
              with the right mentor.
            </p>
            <div className="mt-6">
              <Btn to={`/book-a-call?coach=${coach.slug}`} variant="gold">
                Book a Free Parent Call
              </Btn>
            </div>
          </aside>
        </div>

        <nav aria-label="More coaches" className="wrap mt-14">
          <div className="flex flex-col gap-4 border-t border-black/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
            {previous && (
              <Link to={`/coaches/${previous.slug}`} className={navLinkClass}>
                <span className="sr-only">Previous coach: </span>← {previous.name}
              </Link>
            )}
            <Link to="/coaches" className={navLinkClass}>
              ← All coaches
            </Link>
            {next && (
              <Link to={`/coaches/${next.slug}`} className={navLinkClass}>
                <span className="sr-only">Next coach: </span>
                {next.name} →
              </Link>
            )}
          </div>
        </nav>
      </section>
    </>
  );
}
