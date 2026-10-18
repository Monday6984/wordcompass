// npm run db:migrate
// Runs db/migrations/*.sql in name order against DATABASE_URL. Each file runs once, inside a
// transaction, and is recorded in the schema_migrations table, so it's safe to run again.
import "./_env.mjs";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { root } from "./_env.mjs";
import { getPool } from "../api/_lib/db.js";

const dir = path.join(root, "db", "migrations");
const files = readdirSync(dir).filter((name) => /^\d+_.+\.sql$/.test(name)).sort();

const pool = getPool();
const client = await pool.connect();
try {
  await client.query(`create table if not exists schema_migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`);
  const { rows } = await client.query("select name from schema_migrations");
  const done = new Set(rows.map((row) => row.name));

  let applied = 0;
  for (const name of files) {
    if (done.has(name)) {
      console.log(`  ✓ ${name} (already applied)`);
      continue;
    }
    const sql = readFileSync(path.join(dir, name), "utf8");
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into schema_migrations (name) values ($1)", [name]);
      await client.query("commit");
      applied += 1;
      console.log(`  + ${name}`);
    } catch (error) {
      await client.query("rollback");
      throw new Error(`${name} failed and was rolled back: ${error.message}`);
    }
  }
  console.log(applied ? `Applied ${applied} migration(s).` : "Database is up to date.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
