import React from "react";
import PolicyPage from "@/components/site/PolicyPage";

export default function Privacy() {
  return (
    <PolicyPage
      title="Privacy Policy"
      metaTitle="Privacy Policy | WordCompass Coaching & Mentoring"
      metaDescription="What we collect when you book a parent call, why we collect it, how long we keep it, and your rights. For young people under 16, the parent or guardian is the data contact."
      intro="What we collect, why, and what we never do with it."
      updated="Last updated: [date to come] · [Full policy text to come]"
      blocks={[
        {
          heading: "Who we are",
          paragraphs: [
            "WordCompass Coaching & Mentoring is a trading name of Transformational Vocabularies. [Registered address and company number to come].",
            "Data protection contact: hello@wordcompass.co.uk.",
          ],
        },
        {
          heading: "What we collect",
          bullets: [
            "When you book a parent call: your name, email address, phone number, your child's age, the main challenge you've chosen, your preferred call time, and your consent.",
            "We deliberately do not collect your child's name through this website.",
            "During coaching: session notes, progress themes and the vocabulary words being worked on.",
          ],
        },
        {
          heading: "Who is the data contact for under-16s",
          paragraphs: [
            "For any young person under 16, the parent or guardian is the data contact. Consent to process their information is taken from you, in writing, before session one.",
          ],
        },
        {
          heading: "Why we hold it",
          paragraphs: [
            "To call you back about coaching, to match your child with a mentor, to deliver and review the sessions, and to keep a safeguarding record where required. We rely on your consent, which you can withdraw at any time.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Enquiry records are kept for [retention period to come]. Coaching records are kept for [retention period to come]. Safeguarding records are retained in line with legal requirements.",
          ],
        },
        {
          heading: "Sharing and processors",
          paragraphs: [
            "[List of processors and platforms to come — booking platform, email provider, video platform.]",
            "We do not sell personal data, and we do not use it for advertising.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "You can ask to see the information we hold about you or your child, ask for corrections, ask us to delete it, or withdraw consent. Email hello@wordcompass.co.uk and we'll respond within one month.",
            "If you're unhappy with how we've handled it, you can complain to the Information Commissioner's Office (ico.org.uk).",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "This site uses essential cookies only. See our Cookie Policy for details.",
          ],
        },
      ]}
    />
  );
}
