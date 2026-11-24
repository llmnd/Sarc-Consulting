import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    email?: string;
    organization?: string;
    subject?: string;
    message?: string;
    website?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ detail: "Requête invalide." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ detail: "Demande refusée." }, { status: 400 });
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const subject = body.subject?.trim();
  const message = body.message?.trim();
  const organization = body.organization?.trim() || null;

  if (!name || name.length < 2 || !email || !subject || !message || message.length < 10) {
    return NextResponse.json({ detail: "Veuillez renseigner tous les champs obligatoires." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ detail: "Adresse email invalide." }, { status: 400 });
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO contact_requests (name, email, organization, subject, message)
      VALUES (${name}, ${email}, ${organization}, ${subject}, ${message})
    `;
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ detail: "Votre message n'a pas pu être enregistré." }, { status: 500 });
  }
}
