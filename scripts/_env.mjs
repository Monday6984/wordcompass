// Loads .env and .env.local into process.env for command-line scripts.
// Variables already set in the shell (or by Vercel) win.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const env = loadEnv("development", root, "");
for (const [key, value] of Object.entries(env)) {
  if (process.env[key] === undefined) process.env[key] = value;
}
