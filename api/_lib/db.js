// Neon Postgres connections (server only). DATABASE_URL is the pooled Neon connection string.
//   sql  — HTTP driver for single queries (parent-call, admin API). Always parameterised:
//          sql.query("... where id = $1", [id])
//   pool — WebSocket pool, used by Better Auth (it needs a pg-compatible Pool).
import { Pool, neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

function connectionString() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return url;
}

let httpSql;
let wsPool;

export function getSql() {
  httpSql ??= neon(connectionString());
  return httpSql;
}

export function getPool() {
  wsPool ??= new Pool({ connectionString: connectionString(), max: 3, idleTimeoutMillis: 10_000 });
  return wsPool;
}
