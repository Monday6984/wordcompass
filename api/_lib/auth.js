// Better Auth configuration (server only), shared by:
//   api/auth/[...all].js        — the auth endpoints under /api/auth/*
//   api/_lib/requireAdmin.js    — session + role checks for /api/admin/*
//   scripts/create-admin.mjs    — creating admin accounts
// Users, sessions and rate limits live in the same Neon database (db/migrations/002_auth.sql).
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { getPool } from "./db.js";
import { sendEmail } from "./email.js";

const DAY = 60 * 60 * 24;

// The site's own address. On Vercel preview deployments BETTER_AUTH_URL is usually left
// unset, so the preview's own URL is used instead (reset links then point at the preview).
export function siteBaseUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL.replace(/\/+$/, "");
  const vercelHost = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
  return vercelHost ? `https://${vercelHost}` : "http://localhost:3000";
}

// Origins allowed to call the auth and admin APIs: the live domain (SITE_URL / BETTER_AUTH_URL),
// this deployment's own Vercel URLs (previews), and local `vercel dev`. Deliberately not a
// blanket "*.vercel.app", which would trust anyone's Vercel deployment.
export function allowedOrigins() {
  const origins = new Set(["http://localhost:3000"]);
  for (const value of [process.env.SITE_URL, process.env.BETTER_AUTH_URL]) {
    if (value) origins.add(new URL(value).origin);
  }
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (host) origins.add(`https://${host}`);
  }
  return [...origins];
}

export function createAuth(database) {
  return betterAuth({
    appName: "WordCompass Admin",
    baseURL: siteBaseUrl(),
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,
    database,
    trustedOrigins: allowedOrigins(),

    emailAndPassword: {
      enabled: true,
      // No public sign-up: accounts are only created with `npm run create-admin`.
      disableSignUp: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail({
          to: user.email,
          subject: "Reset your WordCompass admin password",
          text: [
            `Hello${user.name ? ` ${user.name}` : ""},`,
            "",
            "Someone asked to reset the password for your WordCompass admin account.",
            "Use this link within the next hour to choose a new password:",
            "",
            url,
            "",
            "If you didn't ask for this, you can ignore this email. Your password won't change.",
          ].join("\n"),
        });
      },
    },

    // Sessions end after 7 days without activity; each day of use extends them.
    session: {
      expiresIn: 7 * DAY,
      updateAge: DAY,
    },

    // httpOnly + SameSite=Lax cookies; Secure whenever the site runs on https.
    advanced: {
      useSecureCookies: siteBaseUrl().startsWith("https://"),
      defaultCookieAttributes: { httpOnly: true, sameSite: "lax" },
      ipAddress: { ipAddressHeaders: ["x-real-ip", "x-forwarded-for"] },
    },

    // Stored in the database so limits survive serverless cold starts.
    rateLimit: {
      enabled: true,
      storage: "database",
      window: 60,
      max: 60,
      customRules: {
        "/sign-in/email": { window: 15 * 60, max: 10 },
        "/request-password-reset": { window: 60 * 60, max: 5 },
        "/reset-password": { window: 15 * 60, max: 10 },
      },
    },

    // Adds user.role (default "user"). Only role "admin" may use /admin.
    plugins: [admin({ defaultRole: "user", adminRoles: ["admin"] })],
  });
}

let instance;
export function getAuth() {
  instance ??= createAuth(getPool());
  return instance;
}
