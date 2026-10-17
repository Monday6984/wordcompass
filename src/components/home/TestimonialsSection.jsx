import React from "react";
import { TESTIMONIALS } from "@/data/siteContent";

export default function TestimonialsSection() {
  return (
    <section className="bg-warm py-16 sm:py-24">
      <div className="wrap">
        <h2 className="eyebrow">What parents say</h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure key={testimonial.quote} className="card-soft flex h-full flex-col">
              <blockquote className="font-heading text-lg italic leading-[1.5] text-charcoal">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-auto pt-6 font-mono text-xs uppercase tracking-[0.14em] text-mid">
                {testimonial.source}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
