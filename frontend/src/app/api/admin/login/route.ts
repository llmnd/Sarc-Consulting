import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const contentType = request.headers.get("content-type") || "";
    let credentials: unknown;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      credentials = {
        email: String(form.get("email") || ""),
        password: String(form.get("password") || ""),
        website: String(form.get("website") || ""),
      };
    } else {
      credentials = await request.json();
    }

    const backendResponse = await fetch(`${backendUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
    const body = await backendResponse.json().catch(() => ({ detail: "Connexion impossible." }));
    const setCookie = backendResponse.headers.get("set-cookie");
    const cookiePair = setCookie?.split(";")[0];
    const [cookieName, ...cookieValueParts] = cookiePair?.split("=") ?? [];
    const cookieValue = cookieValueParts.join("=");

    function setSessionCookie(response: NextResponse) {
      if (cookieName && cookieValue) {
        response.cookies.set(cookieName, cookieValue, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 8 * 60 * 60,
        });
      } else if (setCookie) {
        response.headers.set("set-cookie", setCookie);
      }
    }

    if (contentType.includes("application/x-www-form-urlencoded")) {
      if (!backendResponse.ok) {
        const params = new URLSearchParams({ error: String(body.detail || "Connexion impossible.") });
        const response = NextResponse.redirect(new URL(`/admin/login?${params.toString()}`, request.url), 303);
        return response;
      }
      const response = NextResponse.redirect(new URL("/admin", request.url), 303);
      setSessionCookie(response);
      return response;
    }
    const response = NextResponse.json(body, { status: backendResponse.status });
    setSessionCookie(response);
    return response;
  } catch {
    return NextResponse.json({ detail: "Backend d'administration indisponible." }, { status: 503 });
  }
}
