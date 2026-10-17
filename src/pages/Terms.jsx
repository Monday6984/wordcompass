import React from "react";
import PolicyPage from "@/components/site/PolicyPage";

export default function Terms() {
  return (
    <PolicyPage
      title="Terms of Service"
      metaTitle="Terms | WordCompass Coaching & Mentoring"
      metaDescription="The terms covering the free six-session coaching programme, scheduling, parental consent, and the limits of coaching as a service."
      intro="The straightforward terms that apply to the free sessions and to continuing after week six."
      updated="Last updated: [date to come] · [Full terms to come]"
      blocks={[
        {
          heading: "Who we are",
          paragraphs: [
            "WordCompass Coaching & Mentoring is a trading name of Transformational Vocabularies. [Registered address and company number to come].",
          ],
        },
        {
          heading: "The free six sessions",
          bullets: [
            "One hour per week, online, one-to-one, for six weeks, at no cost.",
            "No obligation to continue, and no obligation to pay at any point during the six weeks.",
            "Continuing after week six is optional and priced at £X per hour, billed in blocks of six.",
            "[Full block-of-six terms to come]",
          ],
        },
        {
          heading: "Consent and eligibility",
          paragraphs: [
            "Sessions are for young people aged 12 or over. Written consent from a parent or guardian is required before session one, and a parent or guardian must be contactable throughout.",
          ],
        },
        {
          heading: "Scheduling and cancellations",
          paragraphs: [
            "Sessions are booked in advance at times agreed with you. [Cancellation and no-show terms to come].",
          ],
        },
        {
          heading: "What coaching is — and isn't",
          paragraphs: [
            "Coaching and mentoring is forward-looking: goals, habits, confidence and performance. It is not therapy, counselling, medical advice, or a diagnosis, and it is not a substitute for clinical care.",
            "We do not guarantee any particular outcome, grade, selection or result.",
          ],
        },
        {
          heading: "Insurance and liability",
          paragraphs: [
            "All coaches hold professional indemnity and public liability insurance. [Liability wording to come].",
          ],
        },
        {
          heading: "Content and intellectual property",
          paragraphs: [
            "Our vocabulary cards, the Raphael & Ella stories, and all session materials remain our intellectual property. Materials provided to your family are for personal use.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "These terms are governed by the law of England and Wales.",
          ],
        },
      ]}
    />
  );
}
