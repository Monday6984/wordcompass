import React from "react";
import { useSearchParams } from "react-router-dom";
import Btn from "@/components/site/Btn";
import { alertClass, fieldClass, labelClass } from "@/components/site/formStyles";
import { NETWORK_ERROR, authFetchOptions, resetPassword } from "@/lib/authClient";
import AdminShell, { AdminMessage } from "./AdminShell";

const MIN_LENGTH = 12; // keep in step with minPasswordLength in api/_lib/auth.js

// The reset email links to /api/auth/reset-password/<token>, which checks the token and
// sends the user here with ?token=… (or ?error=INVALID_TOKEN if it has expired or been used).
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const linkError = searchParams.get("error");

  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [done, setDone] = React.useState(false);

  if (!token || linkError) {
    return (
      <AdminShell>
        <AdminMessage eyebrow="Admin" title="This reset link has expired or isn't valid">
          <p>Reset links work once and expire after an hour. Please request a new one from the sign-in page.</p>
          <div className="mt-6">
            <Btn to="/admin/login">Back to sign in</Btn>
          </div>
        </AdminMessage>
      </AdminShell>
    );
  }

  if (done) {
    return (
      <AdminShell>
        <AdminMessage eyebrow="Admin" title="Your password has been updated">
          <p>For safety, you've been signed out everywhere. Sign in with your new password.</p>
          <div className="mt-6">
            <Btn to="/admin/login">Sign in</Btn>
          </div>
        </AdminMessage>
      </AdminShell>
    );
  }

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
    try {
      const { error: resetError } = await resetPassword({ newPassword: password, token, fetchOptions: authFetchOptions() });
      if (!resetError) setDone(true);
      else if (resetError.status === 429) setError("Too many attempts. Please wait a few minutes and try again.");
      else setError("This link has expired or has already been used. Please request a new one from the sign-in page.");
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell>
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
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save new password"}
          </Btn>
        </form>
      </div>
    </AdminShell>
  );
}
