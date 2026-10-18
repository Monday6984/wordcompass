// Sends a plain-text email through Resend (RESEND_API_KEY, NOTIFY_EMAIL_FROM).
// Throws if Resend isn't configured or rejects the message; callers decide what that means.
export async function sendEmail({ to, subject, text, replyTo }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!apiKey || !from) throw new Error("RESEND_API_KEY or NOTIFY_EMAIL_FROM is not set");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: (Array.isArray(to) ? to : String(to).split(",")).map((address) => address.trim()).filter(Boolean),
      subject: subject.replace(/[\r\n]+/g, " "),
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
}
