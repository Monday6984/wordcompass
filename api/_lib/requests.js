// Shared query building for the admin request list and CSV export.
// Every value goes in as a $n parameter; only fixed SQL fragments are concatenated.

export const STATUSES = ["New", "Called", "Matched", "Not proceeding"];
export const PAGE_SIZE = 50;
export const COLUMNS =
  "id, created_at, parent_name, email, phone, child_age, main_challenge, preferred_call_time, preferred_coach, status, notes, updated_at";

export function readFilters(req) {
  const params = new URL(req.url, "http://localhost").searchParams;
  const status = STATUSES.includes(params.get("status")) ? params.get("status") : "";
  const q = (params.get("q") || "").trim().slice(0, 100);
  const page = Math.min(Math.max(Number.parseInt(params.get("page") || "1", 10) || 1, 1), 10_000);
  return { status, q, page };
}

const escapeLike = (text) => text.replace(/[\\%_]/g, (char) => `\\${char}`);

/**
 * WHERE clause for a search (and optionally a status), as { text, values }.
 * The search matches parent name, email or phone. Phone also matches ignoring spaces,
 * dashes and brackets, and +44 vs 0, so "07700900123" finds "+44 7700 900 123".
 */
export function buildWhere({ status, q }, { includeStatus = true } = {}) {
  const conditions = [];
  const values = [];
  const add = (value) => {
    values.push(value);
    return `$${values.length}`;
  };

  if (q) {
    const pattern = add(`%${escapeLike(q)}%`);
    const parts = [
      `parent_name ilike ${pattern} escape '\\'`,
      `email ilike ${pattern} escape '\\'`,
      `phone ilike ${pattern} escape '\\'`,
    ];
    // Phone: compare digits only, treating a leading 0 and +44 as the same (07700… = +447700…).
    const digits = q.replace(/[^\d+]/g, "");
    if (digits.replace(/\D/g, "").length >= 3) {
      const national = digits.replace(/^\+44/, "0").replace(/^0044/, "0").replace(/\+/g, "");
      parts.push(
        `regexp_replace(regexp_replace(phone, '[^0-9+]', '', 'g'), '^\\+44', '0') like ${add(`%${escapeLike(national)}%`)} escape '\\'`
      );
    }
    conditions.push(`(${parts.join(" or ")})`);
  }
  if (includeStatus && status) conditions.push(`status = ${add(status)}`);

  return { text: conditions.length ? `where ${conditions.join(" and ")}` : "", values };
}

// ── CSV ─────────────────────────────────────────────────────────────────────
const CSV_COLUMNS = [
  ["Received (UK time)", (row) => formatLondon(row.created_at)],
  ["Parent name", (row) => row.parent_name],
  ["Email", (row) => row.email],
  ["Phone", (row) => row.phone],
  ["Child's age", (row) => row.child_age],
  ["Main challenge", (row) => row.main_challenge],
  ["Preferred call time", (row) => row.preferred_call_time],
  ["Preferred coach", (row) => row.preferred_coach],
  ["Status", (row) => row.status],
  ["Notes", (row) => row.notes],
];

const londonFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/London",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});
const formatLondon = (value) => (value ? londonFormat.format(new Date(value)) : "");

function csvCell(value) {
  let text = value === null || value === undefined ? "" : String(value);
  // Spreadsheet formula injection: a cell starting with = + - @ (or tab / CR) could run as
  // a formula in Excel or Sheets, so it gets a leading apostrophe.
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows) {
  const lines = [
    CSV_COLUMNS.map(([title]) => csvCell(title)).join(","),
    ...rows.map((row) => CSV_COLUMNS.map(([, get]) => csvCell(get(row))).join(",")),
  ];
  // BOM so Excel opens it as UTF-8.
  return "﻿" + lines.join("\r\n") + "\r\n";
}
