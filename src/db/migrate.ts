import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { db, pool } from "./index";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

async function runMigration() {
  console.log("⏳ Menjalankan migrasi database ke Neon PostgreSQL...");
  try {
    await migrate(db, { migrationsFolder: "./src/db/migrations" });
    console.log("✅ Migrasi database berhasil diselesaikan!");
  } catch (error) {
    console.error("❌ Terjadi kesalahan saat migrasi:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration();
