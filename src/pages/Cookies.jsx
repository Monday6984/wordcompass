import React from "react";
import PolicyPage from "@/components/site/PolicyPage";
import { SITE } from "@/data/siteContent";

export default function Cookies() {
  return (
    <PolicyPage
      title="Cookie Policy"
      metaTitle="Cookie Policy | WordCompass Coaching & Mentoring"
      metaDescription="This site uses essential cookies only. Here's exactly what they are, why they're needed, and how to control them in your browser."
      intro="Short version: this site uses essential cookies only. Nothing is used to track or advertise to you."
      updated="Last updated: [date to come]"
      blocks={[
        {
          heading: "What a cookie is",
          paragraphs: [
            "A cookie is a small file a website stores in your browser so it can remember something between page visits.",
          ],
        },
        {
          heading: "What this site uses",
          bullets: [
            "Essential cookies: they keep the site working properly and remember that you've seen our cookie notice.",
            "No advertising cookies. No cross-site tracking cookies.",
            "[Analytics cookies to be confirmed — if we add them, we'll ask you first and update this page.]",
          ],
        },
        {
          heading: "Your choices",
          paragraphs: [
            "You can clear or block cookies in your browser settings at any time. Blocking essential cookies may stop parts of the site working as expected.",
            "The cookie notice you see on your first visit simply asks you to acknowledge it — there's nothing to opt out of beyond essential cookies.",
          ],
        },
        {
          heading: "Questions",
          paragraphs: [`Email ${SITE.email} and we'll explain anything on this page.`],
        },
      ]}
    />
  );
}
