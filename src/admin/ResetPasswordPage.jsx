import React from "react";
import { Link } from "react-router-dom";
import Btn from "@/components/site/Btn";
import { alertClass, fieldClass, labelClass } from "@/components/site/formStyles";
import { initialHash, supabase } from "@/lib/supabase";
import { useAuth } from "./auth";
import AdminShell, { AdminLoading, AdminMessage } from "./AdminShell";

const MIN_LENGTH = 10;

// Supabase's "reset password" email links here. The Supabase client reads the token from
// the link and signs the user in, then they choose a new password.
function linkError() {
  const params = new URLSearchParams(initialHash.replace(/^#/, ""));
  return params.get("error_description") || params.get("error") || "";
}

export default function ResetPasswordPage() {
  const { session } = useAuth();
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [done, setDone] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < MIN_LENGTH) {
      setError(`Please use at least ${MIN_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(updateError.message || "We couldn't update your password. Please try again.");
    else setDone(true);
  };

  if (session === undefined) {
    return (
      <AdminShell>
        <AdminLoading />
      </AdminShell>
    );
  }

  if (!session) {
    const reason = linkError();
    return (
      <AdminShell>
        <AdminMessage eyebrow="Admin" title="This reset link has expired or isn't valid">
          <p>{reason ? `${reason}. ` : ""}Reset links work once and expire after a short time. Please request a new one.</p>
          <div className="mt-6">
            <Btn to="/admin/login">Back to sign in</Btn>
          </div>
        </AdminMessage>
      </AdminShell>
    );
  }

  if (done) {
    return (
      <AdminShell email={session.user.email}>
        <AdminMessage eyebrow="Admin" title="Your password has been updated">
          <div className="mt-2">
            <Btn to="/admin">Go to call requests</Btn>
          </div>
        </AdminMessage>
      </AdminShell>
    );
  }

  return (
    <AdminShell email={session.user.email}>
      <div className="card-soft mx-auto max-w-md">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 font-heading text-2xl font-black text-charcoal sm:text-3xl">Choose a new password</h1>
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <div>
            <label className={labelClass} htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              className={fieldClass}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-describedby="new-password-hint"
            />
            <p id="new-password-hint" className="mt-2 text-sm text-mid">
              At least {MIN_LENGTH} characters.
            </p>
          </div>
          <div>
            <label className={labelClass} htmlFor="confirm-password">
              Confirm new password
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              className={fieldClass}
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className={alertClass}>
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4">
            <Btn type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </Btn>
            <Link to="/admin" className="font-body text-base font-semibold text-teal underline-offset-4 hover:underline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}
