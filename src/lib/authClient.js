import { createAuthClient } from "better-auth/react";

// Better Auth client for the /admin area. It talks to /api/auth on the same site, so the
// session lives in an httpOnly cookie that page scripts can never read.
export const authClient = createAuthClient({
  baseURL: typeof window === "undefined" ? undefined : window.location.origin,
  basePath: "/api/auth",
});

export const { signIn, signOut, useSession, requestPasswordReset, resetPassword } = authClient;
