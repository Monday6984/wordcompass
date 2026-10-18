// /api/auth/* — Better Auth's endpoints (sign in, sign out, session, password reset).
// Configuration lives in api/_lib/auth.js. Sign-up is disabled there.
import { toNodeHandler } from "better-auth/node";
import { getAuth } from "../_lib/auth.js";

let handler;

export default function authHandler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  handler ??= toNodeHandler(getAuth());
  return handler(req, res);
}

// Better Auth reads the raw request body itself.
export const config = { api: { bodyParser: false } };
