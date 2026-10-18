// One-off: downloads the original Base44 site photos (the hero photo has since been replaced) into public/images/photos.
// They are already committed, so you only need this if a file goes missing:
//   npm run fetch-images
// It is not part of dev/build, so Vercel never depends on Base44. Replace any photo by
// overwriting its file (keep the same name), or change the paths in src/data/assets.js.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "images", "photos");

const PHOTOS = {
  "thoughtful-teen.webp":
    "https://media.base44.com/images/public/6ac8b4d3c62ee6ba0972c04d/662221d7c_generated_2605f7fc.webp",
  "method-cards.webp":
    "https://media.base44.com/images/public/6ac8b4d3c62ee6ba0972c04d/5f91224b0_generated_e760c258.webp",
  "online-session.webp":
    "https://media.base44.com/images/public/6ac8b4d3c62ee6ba0972c04d/72da82f33_generated_fbd2be40.webp",
};

mkdirSync(dir, { recursive: true });
const missing = Object.entries(PHOTOS).filter(([name]) => !existsSync(path.join(dir, name)));

if (missing.length === 0) process.exit(0);

console.log(`Downloading ${missing.length} site photo(s) into public/images/photos …`);
let failed = 0;
for (const [name, url] of missing) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(path.join(dir, name), Buffer.from(await res.arrayBuffer()));
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed += 1;
    console.warn(`  ✗ ${name} (${err.message}) — add this file yourself, see README.`);
  }
}
if (failed) console.warn("Some photos are missing; the site still runs, those images just won't show.");
