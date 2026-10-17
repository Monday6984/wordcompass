import React from "react";
import { Link } from "react-router-dom";
import usePageMeta from "@/hooks/usePageMeta";
import Btn from "@/components/site/Btn";

export default function NotFound() {
  usePageMeta("Page not found | WordCompass Coaching & Mentoring");

  return (
    <section className="bg-cream py-20 sm:py-28">
      <div className="wrap-narrow">
        <p className="eyebrow">Error 404</p>
        <h1
          className="mt-4 font-heading font-black text-charcoal"
          style={{ fontSize: "clamp(2.2rem, 4vw, 3.4rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
        >
          We couldn't find that page.
        </h1>
        <p className="measure mt-6 text-lg leading-[1.7] text-mid">
          It may have moved, or the link may be mistyped. These might help instead:
        </p>
        <ul className="mt-6 space-y-2">
          <li><Link to="/how-it-works" className="font-semibold text-teal underline underline-offset-4">How the six free sessions work</Link></li>
          <li><Link to="/coaches" className="font-semibold text-teal underline underline-offset-4">Meet the coaches</Link></li>
          <li><Link to="/faq" className="font-semibold text-teal underline underline-offset-4">Questions parents ask</Link></li>
        </ul>
        <div className="mt-10 flex flex-wrap gap-4">
          <Btn to="/">Back to the homepage</Btn>
          <Btn to="/book-a-call" variant="gold">Book a Free Parent Call</Btn>
        </div>
      </div>
    </section>
  );
}
