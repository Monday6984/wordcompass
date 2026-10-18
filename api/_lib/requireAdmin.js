// Guard for every /api/admin/* function.
//   const session = await requireAdmin(req, res);
//   if (!session) return; // a 401/403 response has already been sent
import { fromNodeHeaders } from "better-auth/node";
import { allowedOrigins, getAuth } from "./auth.js";
import { sendJson } from "./http.js";

export async function requireAdmin(req, res) {
  res.setHeader("Cache-Control", "no-store");

  let session = null;
  try {
    session = await getAuth().api.getSession({ headers: fromNodeHeaders(req.headers) });
  } catch (error) {
    console.error("[requireAdmin] Session check failed:", error.message);
    sendJson(res, 500, { error: "We couldn't check your sign-in just now. Please try again." });
    return null;
  }

  if (!session) {
    sendJson(res, 401, { error: "Please sign in." });
    return null;
  }
  const roles = String(session.user.role || "").split(",").map((role) => role.trim());
  if (!roles.includes("admin") || session.user.banned) {
    sendJson(res, 403, { error: "This account doesn't have admin access." });
    return null;
  }
  return session;
}

// CSRF protection for state-changing requests: the Origin header must be one of ours.
// (SameSite=Lax cookies already stop most cross-site requests; this is a second lock.)
export function hasAllowedOrigin(req) {
  const origin = req.headers.origin;
  return typeof origin === "string" && allowedOrigins().includes(origin);
}
