// npm run create-admin -- someone@example.com "Full Name"
// Creates an admin account with a random temporary password (printed once), or, if the
// email already has an account, makes that account an admin. This is the only way to
// create accounts: public sign-up is switched off.
import "./_env.mjs";
import { randomBytes } from "node:crypto";
import { getAuth } from "../api/_lib/auth.js";
import { getPool, getSql } from "../api/_lib/db.js";

const [rawEmail, ...nameParts] = process.argv.slice(2);
const email = (rawEmail || "").trim().toLowerCase();
const name = nameParts.join(" ").trim();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
  console.error('Usage: npm run create-admin -- someone@example.com "Full Name"');
  process.exit(1);
}

const auth = getAuth();
try {
  const context = await auth.$context;
  const existing = await context.internalAdapter.findUserByEmail(email);

  if (existing) {
    await getSql().query(`update "user" set role = 'admin', "updatedAt" = now() where id = $1`, [existing.user.id]);
    console.log(`${email} already has an account. It is now an admin (password unchanged).`);
  } else {
    // 24 characters from a 144-bit random value.
    const password = randomBytes(18).toString("base64url");
    await auth.api.createUser({ body: { email, password, name: name || email, role: "admin" } });
    console.log(`Admin account created for ${email}.`);
    console.log("");
    console.log(`  Temporary password: ${password}`);
    console.log("");
    console.log("This is shown only once. Sign in at /admin/login, then change it straight away:");
    console.log('sign out, use "Forgot password?" and follow the email link.');
  }
} catch (error) {
  console.error(`Couldn't create the admin: ${error.message}`);
  process.exitCode = 1;
} finally {
  await getPool().end();
}
