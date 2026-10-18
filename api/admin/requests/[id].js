// PATCH /api/admin/requests/:id   body: { status?, notes? }  → the updated row
import { getSql } from "../../_lib/db.js";
import { BodyError, readJsonBody, sendJson } from "../../_lib/http.js";
import { hasAllowedOrigin, requireAdmin } from "../../_lib/requireAdmin.js";
import { COLUMNS, STATUSES } from "../../_lib/requests.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NOTES_MAX = 5000;

export default async function handler(req, res) {
  if (req.method !== "PATCH") return sendJson(res, 405, { error: "Method not allowed." }, { Allow: "PATCH" });
  // CSRF: only our own pages may change data.
  if (!hasAllowedOrigin(req)) return sendJson(res, 403, { error: "This request wasn't allowed." });
  if (!(await requireAdmin(req, res))) return;

  const id = decodeURIComponent(new URL(req.url, "http://localhost").pathname.split("/").filter(Boolean).pop() || "");
  if (!UUID_RE.test(id)) return sendJson(res, 404, { error: "Request not found." });

  if (!String(req.headers["content-type"] || "").toLowerCase().startsWith("application/json")) {
    return sendJson(res, 415, { error: "Please send JSON." });
  }

  let body;
  try {
    body = await readJsonBody(req, 10 * 1024);
  } catch (error) {
    return sendJson(res, error instanceof BodyError ? error.status : 400, { error: error.message });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return sendJson(res, 400, { error: "Invalid request." });

  const keys = Object.keys(body);
  if (keys.length === 0 || keys.some((key) => key !== "status" && key !== "notes")) {
    return sendJson(res, 400, { error: "Only status and notes can be changed." });
  }

  const sets = [];
  const values = [];
  if ("status" in body) {
    if (!STATUSES.includes(body.status)) return sendJson(res, 400, { error: "That isn't a valid status." });
    values.push(body.status);
    sets.push(`status = $${values.length}`);
  }
  if ("notes" in body) {
    if (body.notes !== null && typeof body.notes !== "string") return sendJson(res, 400, { error: "Notes must be text." });
    const notes = typeof body.notes === "string" && body.notes.trim() ? body.notes : null;
    if (notes && notes.length > NOTES_MAX) {
      return sendJson(res, 400, { error: `Please keep notes under ${NOTES_MAX.toLocaleString("en-GB")} characters.` });
    }
    values.push(notes);
    sets.push(`notes = $${values.length}`);
  }
  values.push(id);

  try {
    const rows = await getSql().query(
      `update parent_call_requests set ${sets.join(", ")} where id = $${values.length} returning ${COLUMNS}`,
      values
    );
    if (rows.length === 0) return sendJson(res, 404, { error: "Request not found." });
    return sendJson(res, 200, rows[0]);
  } catch (error) {
    console.error("[admin/requests/:id] Update failed:", error.message);
    return sendJson(res, 500, { error: "We couldn't save that change. Please try again." });
  }
}
