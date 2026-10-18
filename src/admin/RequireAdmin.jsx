import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { signOut, useSession } from "@/lib/authClient";
import AdminShell, { AdminLoading } from "./AdminShell";

export const SignOutContext = React.createContext(() => {});

// Signed out → /admin/login. Whether the account is an admin is decided by the API
// (requests return 403 otherwise), see RequestsPage.
export default function RequireAdmin({ children }) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  const handleSignOut = React.useCallback(async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  if (isPending) {
    return (
      <AdminShell>
        <AdminLoading />
      </AdminShell>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <SignOutContext.Provider value={handleSignOut}>
      <AdminShell email={session.user.email} onSignOut={handleSignOut}>
        {children}
      </AdminShell>
    </SignOutContext.Provider>
  );
}
