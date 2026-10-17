import React from "react";
import { Link } from "react-router-dom";
import { BRAND } from "@/data/assets";
import { FOOTER_LINKS, POLICY_LINKS, SITE } from "@/data/siteContent";

export default function Footer() {
  return (
    <footer className="bg-teal-dark text-white">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-xl bg-cream p-3">
            <img
              src={BRAND.logo}
              alt="WordCompass Coaching and Mentoring"
              width={BRAND.logoWidth}
              height={BRAND.logoHeight}
              loading="lazy"
              className="h-11 w-auto"
            />
          </div>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-white/70">
            {SITE.parentLine}
          </p>
          <p className="mt-5 max-w-xs text-base text-white/80">{SITE.strapline}.</p>
          <p className="mt-6 text-base text-white/80">
            <a href={`mailto:${SITE.email}`} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
              {SITE.email}
            </a>
            <br />
            <a href={SITE.phoneHref} className="underline decoration-white/40 underline-offset-4 hover:decoration-white">
              {SITE.phone}
            </a>
          </p>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">
            Quick links
          </h2>
          <ul className="mt-5 space-y-3">
            {FOOTER_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-base text-white/90 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">Policies</h2>
          <ul className="mt-5 space-y-3">
            {POLICY_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-base text-white/90 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">
            Start here
          </h2>
          <p className="mt-5 text-base text-white/80">
            A free 20-minute call. No obligation, no sales pitch.
          </p>
          <Link
            to="/book-a-call"
            className="mt-5 inline-flex rounded-full bg-gold px-6 py-3 font-body font-semibold text-charcoal transition-colors duration-200 hover:bg-teal-light"
          >
            Book a Free Parent Call
          </Link>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="wrap py-6">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-white/70">
            6 sessions free · DBS checked · Fully insured · Online UK-wide
          </p>
          <p className="mt-3 text-sm text-white/70">{SITE.legal}</p>
        </div>
      </div>
    </footer>
  );
}
