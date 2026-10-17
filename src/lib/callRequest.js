// Validation rules for the "Book a Free Parent Call" form.
// Shared by the browser form (src/components/site/BookCallForm.jsx) and the
// server function (api/parent-call.js), so both always apply the same rules.
// No "@/" imports here: the server imports this file directly.

export const NAME_MAX = 120;
export const AGE_MIN = 12;
export const AGE_MAX = 25;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^(?:\+44|0)\d{9,10}$/;

// Strip spaces, dashes and brackets before checking a UK phone number.
export function cleanPhone(value) {
  return String(value).replace(/[\s\-()]/g, "");
}
