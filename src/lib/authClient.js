import { createAuthClient } from "better-auth/react";

// Better Auth client for the /admin area. It talks to /api/auth on the same site, so the
// session lives in an httpOnly cookie that page scripts can never read.
export const authClient = createAuthClient({
  baseURL: typeof window === "undefined" ? undefined : window.location.origin,
  basePath: "/api/auth",
});

export const { signIn, signOut, useSession, requestPasswordReset, resetPassword } = authClient;

// The client throws (rather than returning an error) when the server can't be reached, and a
// stalled request would otherwise wait forever. Pass these options and catch the throw.
export const authFetchOptions = () => ({ signal: AbortSignal.timeout(30_000) });
export const NETWORK_ERROR = "We couldn't reach the server. Check your connection and try again.";
