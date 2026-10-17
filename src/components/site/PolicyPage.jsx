import React from "react";
import PageHero from "@/components/site/PageHero";
import FinalCta from "@/components/site/FinalCta";
import usePageMeta from "@/hooks/usePageMeta";

/**
 * Shared layout for the four policy pages. Copy arrives as a list of blocks:
 * { heading, paragraphs: [] } or { heading, bullets: [] }.
 */
export default function PolicyPage({ title, metaTitle, metaDescription, intro, updated, blocks, children }) {
  usePageMeta(metaTitle, metaDescription);

  return (
    <>
      <PageHero eyebrow="Policies" title={title} intro={intro}>
        {updated && (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mid">{updated}</p>
        )}
      </PageHero>

      <section className="bg-cream py-14 sm:py-20">
        <div className="wrap-narrow space-y-12">
          {children}
          {blocks.map((block) => (
            <div key={block.heading}>
              <h2 className="font-heading text-2xl font-bold text-charcoal">{block.heading}</h2>
              {block.paragraphs &&
                block.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="measure-wide mt-4 text-mid">
                    {paragraph}
                  </p>
                ))}
              {block.bullets && (
                <ul className="mt-5 space-y-3">
                  {block.bullets.map((bullet) => (
                    <li key={bullet} className="measure-wide flex gap-3 text-mid">
                      <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-teal" aria-hidden="true" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <FinalCta />
    </>
  );
}
