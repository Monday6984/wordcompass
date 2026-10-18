import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import usePageMeta from "@/hooks/usePageMeta";
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

  return (
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
  );
}
