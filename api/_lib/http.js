// Small helpers shared by the /api functions. Files in api/_lib are not deployed
// as endpoints (Vercel skips paths that start with an underscore).
// They only use plain Node req/res, so they behave the same on Vercel and in the
// local Vite dev middleware (see vite.config.js).

export function sendJson(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.end(JSON.stringify(body));
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded) return forwarded.split(",")[0].trim();
  return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

export class BodyError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/**
 * Reads a JSON request body, refusing anything over `limit` bytes.
 * Vercel may already have parsed the body (req.body); otherwise the stream is read.
 */
export async function readJsonBody(req, limit) {
  const declared = Number(req.headers["content-length"] || 0);
  if (declared > limit) throw new BodyError(413, "That request was too large.");

  let raw;
  if (req.body !== undefined && req.body !== null) {
    raw = typeof req.body === "string" ? req.body : Buffer.isBuffer(req.body) ? req.body.toString("utf8") : JSON.stringify(req.body);
  } else {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) {
      size += chunk.length;
      if (size > limit) throw new BodyError(413, "That request was too large.");
      chunks.push(chunk);
    }
    raw = Buffer.concat(chunks).toString("utf8");
  }

  if (Buffer.byteLength(raw, "utf8") > limit) throw new BodyError(413, "That request was too large.");
  try {
    return JSON.parse(raw);
  } catch {
    throw new BodyError(400, "We couldn't read that request. Please try again.");
  }
}
