import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Local development only: serves the Vercel functions in api/*.js from `npm run dev`,
 * so /api/parent-call and /api/blog-feed work without `vercel dev`.
 * On Vercel these files are deployed as serverless functions instead.
 */
function localApi() {
  return {
    name: "local-api",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        const name = (req.url || "").split("?")[0].replace(/^\/+|\/+$/g, "");
        if (!/^[a-z0-9-]+$/.test(name)) return next();
        const file = path.join(root, "api", `${name}.js`);
        if (!fs.existsSync(file)) return next();
        try {
          const mod = await server.ssrLoadModule(file);
          await mod.default(req, res);
        } catch (error) {
          console.error(`[local-api] /api/${name} failed:`, error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
          }
          res.end(JSON.stringify({ error: "Local API error. See the terminal." }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make every variable in .env / .env.local (not just VITE_ ones) available to the
  // local API functions, like Vercel does. Existing shell variables win.
  const env = loadEnv(mode, root, "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    plugins: [react(), localApi()],
    resolve: { alias: { "@": path.resolve(root, "src") } },
  };
});
