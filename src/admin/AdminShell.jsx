import React from "react";
import { Link } from "react-router-dom";
import Btn from "@/components/site/Btn";
import { BRAND } from "@/data/assets";

// Simple admin frame: logo, who's signed in, and Sign out. No public header, footer or cookie banner.
export default function AdminShell({ email, onSignOut, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="border-b border-black/5 bg-cream">
        <div className="wrap flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src={BRAND.logo}
              alt="WordCompass Coaching and Mentoring"
              width={BRAND.logoWidth}
              height={BRAND.logoHeight}
              className="h-9 w-auto"
            />
            <span className="eyebrow">Admin</span>
          </Link>
          {email && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-body text-sm text-mid">
                Signed in as <span className="font-semibold text-charcoal">{email}</span>
              </p>
              {onSignOut && (
                <Btn variant="outline" size="sm" onClick={onSignOut}>
                  Sign out
                </Btn>
              )}
            </div>
          )}
        </div>
      </header>
      <main id="main-content" className="flex-1 py-10 sm:py-14">
        <div className="wrap">{children}</div>
      </main>
    </div>
  );
}

export function AdminMessage({ eyebrow, title, children }) {
  return (
    <div className="card-warm mx-auto max-w-xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-4 font-heading text-2xl font-black text-charcoal sm:text-3xl">{title}</h1>
      <div className="mt-4 text-mid">{children}</div>
    </div>
  );
}

export function AdminLoading() {
  return (
    <p role="status" className="text-center font-body text-mid">
      Loading…
    </p>
  );
}
