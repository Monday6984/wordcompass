// GET /api/admin/export?status=&q=  → CSV of every request matching the current filter.
import { getSql } from "../_lib/db.js";
import { sendJson } from "../_lib/http.js";
import { requireAdmin } from "../_lib/requireAdmin.js";
import { COLUMNS, buildWhere, readFilters, toCsv } from "../_lib/requests.js";

const MAX_ROWS = 20_000;

export default async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." }, { Allow: "GET" });
  if (!(await requireAdmin(req, res))) return;

  const where = buildWhere(readFilters(req));
  try {
    const rows = await getSql().query(
      `select ${COLUMNS} from parent_call_requests ${where.text}
       order by created_at desc limit $${where.values.length + 1}`,
      [...where.values, MAX_ROWS]
    );
    const date = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/London" }); // YYYY-MM-DD
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="wordcompass-requests-${date}.csv"`);
    res.end(toCsv(rows));
  } catch (error) {
    console.error("[admin/export] Query failed:", error.message);
    return sendJson(res, 500, { error: "We couldn't export the list. Please try again." });
  }
}
