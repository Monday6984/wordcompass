import React from "react";
import usePageMeta from "@/hooks/usePageMeta";
import PageHero from "@/components/site/PageHero";
import BookCallForm from "@/components/site/BookCallForm";
import { SITE } from "@/data/siteContent";

const CONFIRMATION = "We'll call you within 48 hours. Nothing to prepare.";

export default function BookACall() {
  usePageMeta(
    "Book a Free Parent Call | WordCompass Coaching & Mentoring",
    "Book a free 20-minute parent call about coaching for your child aged 12+. No obligation, no sales pitch. We'll call you within 48 hours."
  );

  // null = not sent yet; "form" = sent to the form service; "email" = handed to the visitor's email app
  const [sentVia, setSentVia] = React.useState(null);
  const confirmationRef = React.useRef(null);

  React.useEffect(() => {
    if (sentVia) confirmationRef.current?.focus();
  }, [sentVia]);

  return (
    <>
      <PageHero
        eyebrow="Book a free parent call"
        title="Tell us about your child."
        intro="A 20-minute conversation, at a time that suits you. It's a chat, not a sales pitch — and there's nothing to prepare."
      />

      <section className="bg-cream py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[600px] px-6">
          {sentVia ? (
            <div
              ref={confirmationRef}
              tabIndex={-1}
              role="status"
              className="rounded-2xl border border-teal/25 bg-warm p-8 outline-none sm:p-10"
            >
              {sentVia === "email" ? (
                <>
                  <p className="eyebrow">One last step</p>
                  <h2 className="mt-4 font-heading text-2xl font-black text-charcoal sm:text-3xl">
                    Your email app should now be open with your details filled in.
                  </h2>
                  <p className="mt-5 text-mid">
                    Press send and we'll call you within 48 hours. If nothing opened, email us at{" "}
                    <a href={`mailto:${SITE.email}`} className="font-semibold text-teal underline underline-offset-4">
                      {SITE.email}
                    </a>
                    .
                  </p>
                </>
              ) : (
                <>
                  <p className="eyebrow">Request received</p>
                  <h2 className="mt-4 font-heading text-2xl font-black text-charcoal sm:text-3xl">
                    {CONFIRMATION}
                  </h2>
                  <p className="mt-5 text-mid">
                    We'll call the number you gave us, in the window you chose. If anything changes in the
                    meantime, just email {SITE.email}.
                  </p>
                </>
              )}
            </div>
          ) : (
            <>
              <p className="measure-wide text-mid">
                We'll call you to talk through what's going on, answer your questions, and explain how
                the six free sessions work. There's no obligation to go any further.
              </p>
              <div className="mt-9">
                <BookCallForm onSuccess={({ via }) => setSentVia(via)} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
