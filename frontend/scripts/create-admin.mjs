import bcrypt from "bcryptjs";

process.loadEnvFile(".env.local");

const { neon } = await import("@neondatabase/serverless");
const databaseUrl = process.env.DATABASE_URL;
const password = process.env.ADMIN_SETUP_PASSWORD;
const name = process.env.ADMIN_SETUP_NAME || "Aïssata BA SECK";
const email = (process.env.ADMIN_SETUP_EMAIL || "aissata.ba-seck@sarc-consulting.com").toLowerCase();

if (!databaseUrl) throw new Error("DATABASE_URL is missing");

const sql = neon(databaseUrl);
const [count] = await sql.query("SELECT count(*)::int AS count FROM admin_users");
if (count.count > 0) {
  console.log("Admin account already exists");
  process.exit(0);
}

if (!password || password.length < 8) throw new Error("ADMIN_SETUP_PASSWORD must contain at least 8 characters");
const passwordHash = await bcrypt.hash(password, 12);
await sql.query(
  `INSERT INTO admin_users (name, email, password_hash, role, active)
   VALUES ($1, $2, $3, 'admin', true)`,
  [name, email, passwordHash],
);

console.log(`Admin account created for ${email}`);
