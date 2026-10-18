import React from "react";
import { TRUST_ITEMS } from "@/data/siteContent";
import { cn } from "@/lib/utils";

// The five assurances under the hero.
//   Mobile: two-column grid with hairline dividers (the fifth item spans the row).
//   Tablet: three across, then two centred.
//   Desktop: one evenly spaced row with a gold dot centred in each gap.
export default function TrustBar() {
  const last = TRUST_ITEMS.length - 1;

  return (
    <section className="border-y border-black/5 bg-warm">
      <ul className="mx-auto grid w-full max-w-6xl grid-cols-2 px-2 sm:grid-cols-6 sm:px-6 lg:flex lg:items-center lg:justify-between lg:px-6 lg:py-7">
        {TRUST_ITEMS.map((item, index) => (
          <React.Fragment key={item}>
            <li
              className={cn(
                "flex min-h-[3.75rem] items-center justify-center px-3 py-4 text-center font-mono text-[0.6875rem] uppercase leading-snug tracking-[0.14em] text-charcoal sm:col-span-2 sm:text-xs lg:min-h-0 lg:p-0",
                // Mobile grid lines
                index % 2 === 0 && index !== last && "border-r border-black/5 sm:border-r-0",
                index < last && "border-b border-black/5 sm:border-b-0",
                index === last && "col-span-2",
                // Tablet: centre the last two items under the first three
                index === 3 && "sm:col-start-2"
              )}
            >
              {item}
            </li>
            {index < last && (
              <li aria-hidden="true" className="hidden h-1.5 w-1.5 flex-none rounded-full bg-gold lg:block" />
            )}
          </React.Fragment>
        ))}
      </ul>
    </section>
  );
}
