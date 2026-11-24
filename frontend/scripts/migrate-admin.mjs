import fs from "node:fs";
import { neon } from "@neondatabase/serverless";

process.loadEnvFile(".env.local");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is missing");

const sql = neon(databaseUrl);
const migration = fs.readFileSync("migrations/001_admin_cms.sql", "utf8");

for (const statement of migration.split(";").map((item) => item.trim()).filter(Boolean)) {
  await sql.query(`${statement};`);
}

console.log("Admin CMS migration applied");
