import React from "react";
import { Link } from "react-router-dom";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import Accordion from "@/components/site/Accordion";
import FinalCta from "@/components/site/FinalCta";
import { FAQS, SITE } from "@/data/siteContent";

export default function Faq() {
  usePageMeta(
    "Frequently Asked Questions | WordCompass Coaching & Mentoring",
    "Answers for parents: is this therapy, is it suitable for neurodivergent young people, what if my child won't engage, what's kept confidential, and is it really free."
  );

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Questions parents ask"
        intro="Honest answers to the things parents ask us most — including the awkward ones."
      />

      <section className="bg-cream py-14 sm:py-20">
        <div className="wrap">
          <Accordion items={FAQS} />
          <p className="measure-wide mt-10 text-mid">
            Something not covered?{" "}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-teal underline underline-offset-4">
              Email us
            </a>{" "}
            or{" "}
            <Link to="/book-a-call" className="font-semibold text-teal underline underline-offset-4">
              book a free parent call
            </Link>
            .
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
