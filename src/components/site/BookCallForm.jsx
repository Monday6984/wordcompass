import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CALL_TIME_OPTIONS, CHALLENGE_OPTIONS, SITE } from "@/data/siteContent";
import { getCoachBySlug } from "@/data/coaches";
import { AGE_MAX, AGE_MIN, EMAIL_RE, NAME_MAX, PHONE_RE, cleanPhone } from "@/lib/callRequest";
import { alertClass, errorClass, fieldClass, labelClass } from "./formStyles";

/*
 * Where submissions go:
 * The form posts to /api/parent-call (api/parent-call.js), which saves the request in
 * Supabase and emails the owner. If that fails (network error or server error), the
 * visitor is offered a button that opens their email app with the request pre-filled,
 * addressed to SITE.email, so no enquiry is lost.
 */
const API_ENDPOINT = "/api/parent-call";

const emptyForm = {
  parent_name: "",
  email: "",
  phone: "",
  child_age: "",
  main_challenge: "",
  preferred_call_time: "",
  consent: false,
  company: "", // honeypot: real visitors never see or fill this
};

function buildSummary(data) {
  return [
    "A new parent call request from the WordCompass website.",
    "",
    `Parent / guardian: ${data.parent_name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Child's age: ${data.child_age}`,
    `Main challenge: ${data.main_challenge}`,
    `Preferred call time: ${data.preferred_call_time}`,
    ...(data.preferred_coach ? [`Preferred coach: ${data.preferred_coach}`] : []),
    `Consent to be contacted: yes`,
  ].join("\n");
}

export default function BookCallForm({ onSuccess }) {
  const [form, setForm] = React.useState(emptyForm);
  const [errors, setErrors] = React.useState({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  // Set when the server can't be reached, so the email fallback can be offered.
  const [fallbackData, setFallbackData] = React.useState(null);
  const [searchParams] = useSearchParams();
  const coach = getCoachBySlug(searchParams.get("coach"));

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const next = {};
    const name = form.parent_name.trim();
    if (!name) next.parent_name = "Please tell us your name.";
    else if (name.length > NAME_MAX) next.parent_name = `Please shorten your name to ${NAME_MAX} characters.`;
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Please enter a valid email address.";
    if (!PHONE_RE.test(cleanPhone(form.phone)))
      next.phone = "Please enter a valid UK phone number.";
    const age = Number(form.child_age);
    if (!form.child_age || Number.isNaN(age) || age < AGE_MIN || age > AGE_MAX)
      next.child_age = "Young people we work with are aged 12 or over.";
    if (!form.main_challenge) next.main_challenge = "Please choose the main challenge.";
    if (!form.preferred_call_time) next.preferred_call_time = "Please choose a preferred time.";
    if (!form.consent) next.consent = "Please confirm we may contact you.";
    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const firstField = Object.keys(found)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    const data = {
      parent_name: form.parent_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      child_age: Number(form.child_age),
      main_challenge: form.main_challenge,
      preferred_call_time: form.preferred_call_time,
      ...(coach ? { preferred_coach: coach.name } : {}),
      consent: true,
    };

    setSubmitting(true);
    setSubmitError("");
    setFallbackData(null);
    try {
      let response = null;
      try {
        response = await fetch(API_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          // The hidden honeypot goes too; the server quietly drops bot submissions.
          body: JSON.stringify({ ...data, company: form.company }),
        });
      } catch {
        // Network error: handled below with the email fallback.
      }

      if (response?.ok) {
        onSuccess({ via: "form" });
        return;
      }

      if (response && response.status < 500) {
        // The server turned the request down (e.g. a field or too many attempts): say why.
        const result = await response.json().catch(() => ({}));
        setSubmitError(result.error || "Something wasn't quite right. Please check your details and try again.");
      } else {
        setSubmitError("We couldn't send that just now. Please try again, or send your request by email instead.");
        setFallbackData(data);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const sendByEmail = () => {
    const subject = `Parent call request - ${fallbackData.parent_name}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildSummary(fallbackData))}`;
    onSuccess({ via: "email" });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-7">
      {coach && (
        <p className="rounded-xl border border-teal/25 bg-warm px-4 py-3 font-body text-base text-charcoal">
          You'd like to talk about working with <strong className="font-semibold">{coach.name}</strong>.
        </p>
      )}

      <div>
        <label className={labelClass} htmlFor="parent_name">
          Parent or guardian name
        </label>
        <input
          id="parent_name"
          name="parent_name"
          type="text"
          autoComplete="name"
          className={fieldClass}
          value={form.parent_name}
          onChange={(event) => update("parent_name", event.target.value)}
          aria-invalid={Boolean(errors.parent_name)}
          aria-describedby={errors.parent_name ? "parent_name-error" : undefined}
        />
        {errors.parent_name && <p id="parent_name-error" className={errorClass}>{errors.parent_name}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={fieldClass}
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <p id="email-error" className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="07XXX XXX XXX"
          className={fieldClass}
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
        {errors.phone && <p id="phone-error" className={errorClass}>{errors.phone}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="child_age">
          Your child's age
        </label>
        <input
          id="child_age"
          name="child_age"
          type="number"
          min={12}
          inputMode="numeric"
          className={fieldClass}
          value={form.child_age}
          onChange={(event) => update("child_age", event.target.value)}
          aria-invalid={Boolean(errors.child_age)}
          aria-describedby={errors.child_age ? "child_age-hint child_age-error" : "child_age-hint"}
        />
        <p id="child_age-hint" className="mt-2 text-sm text-mid">We work with young people aged 12+.</p>
        {errors.child_age && <p id="child_age-error" className={errorClass}>{errors.child_age}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="main_challenge">
          Main challenge
        </label>
        <select
          id="main_challenge"
          name="main_challenge"
          className={fieldClass}
          value={form.main_challenge}
          onChange={(event) => update("main_challenge", event.target.value)}
          aria-invalid={Boolean(errors.main_challenge)}
          aria-describedby={errors.main_challenge ? "main_challenge-error" : undefined}
        >
          <option value="">Please choose…</option>
          {CHALLENGE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.main_challenge && <p id="main_challenge-error" className={errorClass}>{errors.main_challenge}</p>}
      </div>

      <div>
        <label className={labelClass} htmlFor="preferred_call_time">
          Preferred call time
        </label>
        <select
          id="preferred_call_time"
          name="preferred_call_time"
          className={fieldClass}
          value={form.preferred_call_time}
          onChange={(event) => update("preferred_call_time", event.target.value)}
          aria-invalid={Boolean(errors.preferred_call_time)}
          aria-describedby={errors.preferred_call_time ? "preferred_call_time-error" : undefined}
        >
          <option value="">Please choose…</option>
          {CALL_TIME_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.preferred_call_time && (
          <p id="preferred_call_time-error" className={errorClass}>{errors.preferred_call_time}</p>
        )}
      </div>

      {/* Honeypot field, hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.company}
          onChange={(event) => update("company", event.target.value)}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          className="mt-1.5 h-5 w-5 flex-none rounded border-black/25 text-teal-dark accent-teal-dark"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "consent-error" : undefined}
        />
        <label htmlFor="consent" className="font-body text-base text-mid">
          I consent to WordCompass contacting me about coaching for my child, and I've read the{" "}
          <Link to="/privacy" className="font-semibold text-teal underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {errors.consent && <p id="consent-error" className={errorClass}>{errors.consent}</p>}

      {submitError && (
        <div role="alert" className={alertClass}>
          <p>{submitError}</p>
          {fallbackData && (
            <button
              type="button"
              onClick={sendByEmail}
              className="mt-3 inline-flex items-center justify-center rounded-full border border-teal-dark/35 bg-white px-5 py-2.5 text-sm font-semibold text-charcoal transition-colors duration-200 hover:border-teal-dark"
            >
              Send by email instead
            </button>
          )}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-full bg-teal-dark px-8 py-4 font-body text-base font-semibold text-white transition-colors duration-200 hover:bg-teal-light hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? "Sending…" : "Book Your Free Parent Call"}
        </button>
      </div>
    </form>
  );
}
