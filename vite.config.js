import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

// `npm run dev` = Vite only (frontend). `npm run dev:full` = `vercel dev`, which runs this
// Vite app and the /api functions together on http://localhost:3000.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(root, "src") } },
});
