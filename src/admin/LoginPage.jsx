import React from "react";
import { Navigate } from "react-router-dom";
import Btn from "@/components/site/Btn";
import { alertClass, fieldClass, labelClass } from "@/components/site/formStyles";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./auth";
import AdminShell from "./AdminShell";

export default function LoginPage() {
  const { session } = useAuth();
  const [mode, setMode] = React.useState("signin"); // "signin" | "forgot"
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  if (session) return <Navigate to="/admin" replace />;

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (signInError) setError("That email and password don't match an account. Please try again.");
  };

  const handleForgot = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setBusy(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/reset-password`,
    });
    setBusy(false);
    if (resetError) {
      setError("We couldn't send a reset link just now. Please try again in a few minutes.");
    } else {
      setNotice("If that email belongs to an account, a link to set a new password is on its way.");
    }
  };

  return (
    <AdminShell>
      <div className="card-soft mx-auto max-w-md">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 font-heading text-2xl font-black text-charcoal sm:text-3xl">
          {mode === "signin" ? "Sign in" : "Reset your password"}
        </h1>

        <form onSubmit={mode === "signin" ? handleSignIn : handleForgot} noValidate className="mt-8 space-y-6">
          <div>
            <label className={labelClass} htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              className={fieldClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {mode === "signin" && (
            <div>
              <label className={labelClass} htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                className={fieldClass}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
          )}

          {error && (
            <p role="alert" className={alertClass}>
              {error}
            </p>
          )}
          {notice && (
            <p role="status" className="rounded-xl border border-teal/25 bg-warm px-4 py-3 font-body text-base text-charcoal">
              {notice}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Btn type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Send reset link"}
            </Btn>
            <button
              type="button"
              onClick={() => switchMode(mode === "signin" ? "forgot" : "signin")}
              className="font-body text-base font-semibold text-teal underline-offset-4 hover:underline"
            >
              {mode === "signin" ? "Forgot password?" : "Back to sign in"}
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
