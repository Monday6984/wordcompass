import React from "react";
import { TRUST_ITEMS } from "@/data/siteContent";

export default function TrustBar() {
  return (
    <section className="border-y border-black/5 bg-warm">
      <div className="wrap py-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {TRUST_ITEMS.map((item, index) => (
            <li
              key={item}
              className="flex items-center gap-6 font-mono text-xs uppercase tracking-[0.14em] text-mid"
            >
              {item}
              {index < TRUST_ITEMS.length - 1 && (
                <span className="text-gold" aria-hidden="true">
                  •
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
