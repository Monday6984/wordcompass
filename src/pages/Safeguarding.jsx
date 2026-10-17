import React from "react";
import PolicyPage from "@/components/site/PolicyPage";

export default function Safeguarding() {
  return (
    <PolicyPage
      title="Safeguarding & Child Protection"
      metaTitle="Safeguarding Policy | WordCompass Coaching & Mentoring"
      metaDescription="Our safeguarding commitment: written parental consent before session one, enhanced DBS checks with barred list, an agreed session platform, and clear referral routes."
      intro="How we keep young people safe, and exactly what happens if we're ever worried about one."
      updated="Last updated: [date to come]"
      blocks={[
        {
          heading: "Before any session begins",
          paragraphs: [
            "We require written consent from a parent or guardian before session one. No consent, no session — without exception.",
            "Sessions take place on an agreed platform, at an agreed time, with no one-to-one contact between mentor and young person outside those sessions. If a session is recorded, it is only ever with written consent.",
          ],
        },
        {
          heading: "Our coaches",
          bullets: [
            "Enhanced DBS check with barred list check for every coach.",
            "Professional indemnity and public liability insurance in place.",
            "Safeguarding and online session safety training completed.",
            "Coaches are mentors, not therapists, and do not work outside that role.",
            "[Training provider and certificate dates to come]",
          ],
        },
        {
          heading: "Confidentiality and its limits",
          paragraphs: [
            "Young people need a space that feels genuinely theirs, so we don't report private disclosures to parents. We do share themes and progress.",
            "The limits are absolute: anything that suggests a young person or someone else is at risk is shared with the parent or guardian and, where required, with the relevant authority. Mentors are supported through the same process.",
          ],
        },
        {
          heading: "If we're concerned about a young person",
          paragraphs: [
            "We will tell you, as the parent or guardian, what we've noticed and what we're doing next.",
            "Where clinical support looks appropriate, we'll say so honestly and signpost you. Referral routes include your GP and local CAMHS (Child and Adolescent Mental Health Services). In an emergency, always call 999.",
          ],
        },
        {
          heading: "Concerns and complaints",
          paragraphs: [
            "If you have any concern about a session, a mentor, or something your child has said, contact the named safeguarding lead immediately. We log every concern and review it.",
            "Contact: [Safeguarding lead name to come] · [safeguarding@wordcompass.co.uk] · 07XXX XXX XXX",
          ],
        },
      ]}
    >
      <div className="rounded-2xl border border-black/10 bg-warm p-7">
        <h2 className="font-heading text-2xl font-bold text-charcoal">Documents</h2>
        <p className="measure-wide mt-4 text-mid">
          Our full safeguarding policy will be available to download here.
        </p>
        {/* When the PDF is ready: put it in public/documents/ and replace this span with
            <a href="/documents/safeguarding-policy.pdf" download className="...">Download…</a> */}
        <span className="mt-5 inline-flex cursor-not-allowed items-center rounded-full border border-teal-dark/30 px-6 py-3 font-body font-semibold text-mid">
          Download the Safeguarding Policy (PDF) — coming soon
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-mid">
          Named safeguarding lead: [Name to come]
        </p>
      </div>
    </PolicyPage>
  );
}
