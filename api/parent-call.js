// POST /api/parent-call
// Receives the "Book a Free Parent Call" form, re-checks every field, saves it to
// Supabase (service role key, server-only) and emails the owner via Resend.
//
// Env vars (server-only, never VITE_-prefixed):
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM

import { createClient } from "@supabase/supabase-js";
import { BodyError, getClientIp, readJsonBody, sendJson } from "./_lib/http.js";
import { AGE_MAX, AGE_MIN, EMAIL_RE, NAME_MAX, PHONE_RE, cleanPhone } from "../src/lib/callRequest.js";
import { CALL_TIME_OPTIONS, CHALLENGE_OPTIONS } from "../src/data/siteContent.js";
import { COACHES } from "../src/data/coaches.js";

const MAX_BODY_BYTES = 10 * 1024;
const ALLOWED_FIELDS = new Set([
  "parent_name",
  "email",
  "phone",
  "child_age",
  "main_challenge",
  "preferred_call_time",
  "preferred_coach",
  "consent",
  "company", // honeypot
]);
const COACH_NAMES = new Set(COACHES.map((coach) => coach.name));

// ── Rate limit ──────────────────────────────────────────────────────────────
// 5 submissions per IP per 10 minutes. Kept in memory, so it resets whenever
// Vercel starts a fresh instance (cold start) and isn't shared between instances.
// It's a speed bump for casual abuse, not a guarantee.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

// ── Validation ──────────────────────────────────────────────────────────────
function validate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "We couldn't read that request. Please try again." };
  }
  if (Object.keys(body).some((key) => !ALLOWED_FIELDS.has(key))) {
    return { error: "That request included unexpected information. Please refresh the page and try again." };
  }

  const str = (value) => (typeof value === "string" ? value.trim() : "");
  const parentName = str(body.parent_name);
  const email = str(body.email);
  const phone = str(body.phone);
  const challenge = str(body.main_challenge);
  const callTime = str(body.preferred_call_time);
  const coach = str(body.preferred_coach);
  const age =
    typeof body.child_age === "number"
      ? body.child_age
      : /^\d{1,3}$/.test(str(body.child_age))
        ? Number(str(body.child_age))
        : NaN;

  if (!parentName) return { error: "Please tell us your name." };
  if (parentName.length > NAME_MAX) return { error: `Please shorten your name to ${NAME_MAX} characters.` };
  if (email.length > 254 || !EMAIL_RE.test(email)) return { error: "Please enter a valid email address." };
  if (phone.length > 40 || !PHONE_RE.test(cleanPhone(phone))) return { error: "Please enter a valid UK phone number." };
  if (!Number.isInteger(age) || age < AGE_MIN || age > AGE_MAX) {
    return { error: "Young people we work with are aged 12 or over." };
  }
  if (!CHALLENGE_OPTIONS.includes(challenge)) return { error: "Please choose the main challenge." };
  if (!CALL_TIME_OPTIONS.includes(callTime)) return { error: "Please choose a preferred time." };
  if (coach && !COACH_NAMES.has(coach)) return { error: "We couldn't find that coach. Please refresh the page and try again." };
  if (body.consent !== true) return { error: "Please confirm we may contact you." };

  return {
    row: {
      parent_name: parentName,
      email,
      phone,
      child_age: age,
      main_challenge: challenge,
      preferred_call_time: callTime,
      preferred_coach: coach || null,
      consent: true,
    },
  };
}

// ── Email alert ─────────────────────────────────────────────────────────────
async function sendAlert(row) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!apiKey || !to || !from) {
    console.error("[parent-call] Email alert skipped: RESEND_API_KEY, NOTIFY_EMAIL_TO or NOTIFY_EMAIL_FROM is not set.");
    return;
  }

  const received = new Date().toLocaleString("en-GB", { timeZone: "Europe/London", dateStyle: "full", timeStyle: "short" });
  const text = [
    "A new parent call request from the WordCompass website.",
    "",
    `Parent / guardian: ${row.parent_name}`,
    `Email: ${row.email}`,
    `Phone: ${row.phone}`,
    `Child's age: ${row.child_age}`,
    `Main challenge: ${row.main_challenge}`,
    `Preferred call time: ${row.preferred_call_time}`,
    `Preferred coach: ${row.preferred_coach || "No preference"}`,
    "Consent to be contacted: yes",
    `Received: ${received}`,
    "",
    "Reply to this email to contact the parent directly. Manage requests at /admin.",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((address) => address.trim()).filter(Boolean),
      reply_to: row.email,
      subject: `New parent call request – ${row.parent_name.replace(/[\r\n]+/g, " ")}`,
      text,
    }),
  });
  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

// ── Handler ─────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return sendJson(res, 405, { error: "Method not allowed." }, { Allow: "POST" });
  }

  let body;
  try {
    body = await readJsonBody(req, MAX_BODY_BYTES);
  } catch (error) {
    const status = error instanceof BodyError ? error.status : 400;
    return sendJson(res, status, { error: error.message || "We couldn't read that request." });
  }

  // Honeypot: bots fill the hidden "company" field. Pretend it worked, save nothing.
  if (body && typeof body === "object" && typeof body.company === "string" && body.company.trim() !== "") {
    return sendJson(res, 200, { ok: true });
  }

  if (isRateLimited(getClientIp(req))) {
    return sendJson(
      res,
      429,
      { error: "We've had several requests from you in a short time. Please wait a few minutes and try again." },
      { "Retry-After": String(RATE_WINDOW_MS / 1000) }
    );
  }

  const { row, error } = validate(body);
  if (error) return sendJson(res, 400, { error });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.error("[parent-call] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set.");
    return sendJson(res, 500, { error: "We couldn't save your request just now." });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: insertError } = await supabase.from("parent_call_requests").insert(row);
  if (insertError) {
    console.error("[parent-call] Insert failed:", insertError.message);
    return sendJson(res, 500, { error: "We couldn't save your request just now." });
  }

  // The request is saved; a failed email must not turn that into an error for the parent.
  try {
    await sendAlert(row);
  } catch (emailError) {
    console.error("[parent-call] Email alert failed:", emailError.message);
  }

  return sendJson(res, 200, { ok: true });
}
