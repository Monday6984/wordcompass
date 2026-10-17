// Writes public/sitemap.xml and public/robots.txt before every build (`npm run build`).
// Pages come from the list below plus every coach in src/data/coaches.js.
// The domain comes from SITE_URL (Vercel env var, or .env / .env.local locally).
// /admin is never listed, and robots.txt tells search engines to stay out of it.
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { COACHES } from "../src/data/coaches.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLACEHOLDER = "https://www.example.com";

// Public pages (keep in step with the routes in src/App.jsx).
const ROUTES = [
  "/",
  "/how-it-works",
  "/our-method",
  "/for-parents",
  "/for-young-people",
  "/coaches",
  "/pricing",
  "/faq",
  "/blog",
  "/book-a-call",
  "/safeguarding",
  "/privacy",
  "/terms",
  "/cookies",
];

const env = { ...loadEnv("production", root, ""), ...process.env };
let siteUrl = (env.SITE_URL || "").trim().replace(/\/+$/, "");
if (!/^https?:\/\/[^/]+$/i.test(siteUrl)) {
  console.warn(`SITE_URL is not set (or not a bare https://domain). Using ${PLACEHOLDER} in the sitemap.`);
  siteUrl = PLACEHOLDER;
}

const escapeXml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const paths = [...ROUTES, ...COACHES.map((coach) => `/coaches/${coach.slug}`)];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((page) => `  <url><loc>${escapeXml(siteUrl + (page === "/" ? "/" : page))}</loc></url>`).join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(path.join(root, "public", "sitemap.xml"), sitemap);
writeFileSync(path.join(root, "public", "robots.txt"), robots);
console.log(`Sitemap: ${paths.length} pages for ${siteUrl}`);
