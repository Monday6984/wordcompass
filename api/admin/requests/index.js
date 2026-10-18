// GET /api/admin/requests?status=&q=&page=
// → { items, total, counts: { New, Called, Matched, "Not proceeding" }, page, pageSize }
// Newest first, 50 per page. Counts follow the search but not the status filter,
// so the status tabs show how many matches each tab holds.
import { getSql } from "../../_lib/db.js";
import { sendJson } from "../../_lib/http.js";
import { requireAdmin } from "../../_lib/requireAdmin.js";
import { COLUMNS, PAGE_SIZE, STATUSES, buildWhere, readFilters } from "../../_lib/requests.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." }, { Allow: "GET" });
  if (!(await requireAdmin(req, res))) return;

  const filters = readFilters(req);
  const where = buildWhere(filters);
  const searchOnly = buildWhere(filters, { includeStatus: false });
  const limit = where.values.length + 1;
  const offset = where.values.length + 2;

  try {
    const sql = getSql();
    const [items, totals, countRows] = await Promise.all([
      sql.query(
        `select ${COLUMNS} from parent_call_requests ${where.text}
         order by created_at desc limit $${limit} offset $${offset}`,
        [...where.values, PAGE_SIZE, (filters.page - 1) * PAGE_SIZE]
      ),
      sql.query(`select count(*)::int as total from parent_call_requests ${where.text}`, where.values),
      sql.query(
        `select status, count(*)::int as count from parent_call_requests ${searchOnly.text} group by status`,
        searchOnly.values
      ),
    ]);

    const counts = Object.fromEntries(STATUSES.map((status) => [status, 0]));
    for (const row of countRows) counts[row.status] = row.count;

    return sendJson(res, 200, { items, total: totals[0].total, counts, page: filters.page, pageSize: PAGE_SIZE });
  } catch (error) {
    console.error("[admin/requests] Query failed:", error.message);
    return sendJson(res, 500, { error: "We couldn't load the requests. Please try again." });
  }
}
