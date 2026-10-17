import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import usePageMeta from "@/hooks/usePageMeta";
import { supabase } from "@/lib/supabase";
import { AuthProvider } from "./auth";
import AdminShell from "./AdminShell";
import RequireAdmin from "./RequireAdmin";
import LoginPage from "./LoginPage";
import ResetPasswordPage from "./ResetPasswordPage";
import RequestsPage from "./RequestsPage";

// Keeps the admin area out of search engines while it's open.
function useNoIndex() {
  React.useEffect(() => {
    const tag = document.createElement("meta");
    tag.setAttribute("name", "robots");
    tag.setAttribute("content", "noindex,nofollow");
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);
}

// Loaded with React.lazy from App.jsx, so public visitors never download this code.
export default function AdminApp() {
  useNoIndex();
  usePageMeta("Admin | WordCompass Coaching & Mentoring");

  if (!supabase) {
    return (
      <AdminShell>
        <div className="card-warm mx-auto max-w-xl">
          <p className="eyebrow">Admin</p>
          <h1 className="mt-4 font-heading text-2xl font-black text-charcoal">Admin isn't set up yet</h1>
          <p className="mt-4 text-mid">
            Add <code className="font-mono text-sm">VITE_SUPABASE_URL</code> and{" "}
            <code className="font-mono text-sm">VITE_SUPABASE_ANON_KEY</code> to the environment variables
            (see README), then rebuild.
          </p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route
          index
          element={
            <RequireAdmin>
              <RequestsPage />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
