import React from "react";
import { Navigate } from "react-router-dom";
import Btn from "@/components/site/Btn";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./auth";
import AdminShell, { AdminLoading, AdminMessage } from "./AdminShell";

// Signed out → /admin/login. Signed in but not in the admins table → "no access".
export default function RequireAdmin({ children }) {
  const { session, signOut } = useAuth();
  const userId = session?.user?.id;
  const [check, setCheck] = React.useState({ userId: null, isAdmin: null, failed: false });

  React.useEffect(() => {
    if (!userId) return;
    let active = true;
    supabase.rpc("is_admin").then(({ data, error }) => {
      if (active) setCheck({ userId, isAdmin: data === true, failed: Boolean(error) });
    });
    return () => {
      active = false;
    };
  }, [userId]);

  if (session === undefined) {
    return (
      <AdminShell>
        <AdminLoading />
      </AdminShell>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;

  const email = session.user.email;
  if (check.userId !== userId) {
    return (
      <AdminShell email={email} onSignOut={signOut}>
        <AdminLoading />
      </AdminShell>
    );
  }

  if (!check.isAdmin) {
    return (
      <AdminShell email={email} onSignOut={signOut}>
        <AdminMessage eyebrow="Admin" title="This account doesn't have admin access">
          <p>
            {check.failed
              ? "We couldn't check your access just now. Please try again in a moment."
              : "If you think it should, ask the site owner to add you as an admin."}
          </p>
          <div className="mt-6">
            <Btn onClick={signOut}>Sign out</Btn>
          </div>
        </AdminMessage>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={email} onSignOut={signOut}>
      {children}
    </AdminShell>
  );
}
