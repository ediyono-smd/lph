import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import ws from "ws";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

// Support WebSocket in Node.js environments (CLI, scripts, seeds)
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}
neonConfig.fetchConnectionCache = true;

export const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });

export type Database = typeof db;
