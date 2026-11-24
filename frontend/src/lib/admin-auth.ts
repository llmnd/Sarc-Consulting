import "server-only";
import bcrypt from "bcryptjs";
import { neon } from "@neondatabase/serverless";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
};

export const adminCookieName = "sarc_admin_session";

export function getSql() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
  return neon(process.env.DATABASE_URL);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is missing");
  return new TextEncoder().encode(secret);
}

export async function createAdminToken(session: AdminSession) {
  return new SignJWT({
    name: session.name,
    email: session.email,
    role: session.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getSessionSecret());
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(adminCookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const id = payload.sub;
    if (!id || typeof payload.email !== "string" || typeof payload.name !== "string") return null;

    const sql = getSql();
    const [user] = await sql`
      SELECT id::text, name, email, role
      FROM admin_users
      WHERE id = ${id}::uuid AND active = true
      LIMIT 1
    `;
    if (!user) return null;

    return {
      id: String(user.id),
      name: String(user.name),
      email: String(user.email),
      role: user.role === "editor" ? "editor" : "admin",
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
