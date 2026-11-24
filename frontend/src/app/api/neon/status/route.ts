import { neon } from "@neondatabase/serverless";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

type ServiceStatus = {
  configured: boolean;
  ok: boolean;
  detail?: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const statuses: Record<string, ServiceStatus> = {};

  try {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing");
    const sql = neon(process.env.DATABASE_URL);
    const [result] = await sql`SELECT 1 AS ok, current_database() AS database_name`;
    statuses.postgres = {
      configured: true,
      ok: result.ok === 1,
      detail: String(result.database_name),
    };
  } catch (error) {
    statuses.postgres = { configured: Boolean(process.env.DATABASE_URL), ok: false, detail: errorMessage(error) };
  }

  try {
    if (!process.env.AWS_ENDPOINT_URL_S3 || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error("Object Storage environment variables are missing");
    }
    const storage = new S3Client({ forcePathStyle: true });
    await storage.send(new ListBucketsCommand({}));
    statuses.objectStorage = { configured: true, ok: true };
  } catch (error) {
    statuses.objectStorage = { configured: Boolean(process.env.AWS_ENDPOINT_URL_S3), ok: false, detail: errorMessage(error) };
  }

  statuses.auth = await checkAuth();
  statuses.aiGateway = await checkAiGateway();
  statuses.realtime = checkRealtime();
  statuses.functions = await checkFunction();

  const ok = Object.values(statuses).every((status) => status.ok);
  return NextResponse.json({ ok, services: statuses }, { status: ok ? 200 : 503 });
}

async function checkAuth(): Promise<ServiceStatus> {
  if (!process.env.NEON_AUTH_BASE_URL || !process.env.NEON_AUTH_JWKS_URL) {
    return { configured: false, ok: false, detail: "Neon Auth environment variables are missing" };
  }

  try {
    const response = await fetch(process.env.NEON_AUTH_JWKS_URL, { cache: "no-store" });
    return { configured: true, ok: response.ok, detail: response.ok ? "JWKS reachable" : `HTTP ${response.status}` };
  } catch (error) {
    return { configured: true, ok: false, detail: errorMessage(error) };
  }
}

async function checkAiGateway(): Promise<ServiceStatus> {
  if (!process.env.NEON_AI_GATEWAY_BASE_URL || !process.env.NEON_AI_GATEWAY_TOKEN) {
    return { configured: false, ok: false, detail: "AI Gateway credentials are missing" };
  }

  try {
    const response = await fetch(`${process.env.NEON_AI_GATEWAY_BASE_URL}/v1/models`, {
      headers: { Authorization: `Bearer ${process.env.NEON_AI_GATEWAY_TOKEN}` },
      cache: "no-store",
    });
    const body = await response.json().catch(() => null) as { data?: Array<{ enabled?: boolean }>; unavailable_reason?: string } | null;
    if (!response.ok) return { configured: true, ok: false, detail: body?.unavailable_reason ?? `HTTP ${response.status}` };
    const enabledCount = body?.data?.filter((model) => model.enabled).length ?? 0;
    return { configured: true, ok: enabledCount > 0, detail: enabledCount > 0 ? `${enabledCount} models enabled` : "No prepaid model credits enabled" };
  } catch (error) {
    return { configured: true, ok: false, detail: errorMessage(error) };
  }
}

function checkRealtime(): ServiceStatus {
  const configured = Boolean(process.env.NEON_REALTIME_URL && process.env.NEON_REALTIME_SECRET);
  return configured
    ? { configured: true, ok: true, detail: "Realtime credentials configured" }
    : { configured: false, ok: false, detail: "Realtime environment variables are missing" };
}

async function checkFunction(): Promise<ServiceStatus> {
  if (!process.env.NEON_BRANCH_ID || !process.env.NEON_FUNCTION_HOST_SUFFIX) {
    return { configured: false, ok: false, detail: "Function host variables are missing" };
  }

  try {
    const response = await fetch(`https://${process.env.NEON_BRANCH_ID}-hello${process.env.NEON_FUNCTION_HOST_SUFFIX}/`, { cache: "no-store" });
    const text = await response.text();
    return { configured: true, ok: response.ok && text.includes("Hello"), detail: response.ok ? text : `HTTP ${response.status}` };
  } catch (error) {
    return { configured: true, ok: false, detail: errorMessage(error) };
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}
