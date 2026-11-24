"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function AdminSetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/setup/status")
      .then((response) => response.json())
      .then((body) => {
        if (body.configured) window.location.assign("/admin/login");
      })
      .catch(() => {});
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("loading");
    setMessage("");
    const data = new FormData(form);

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
          website: data.get("website"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail);
      setStatus("success");
      setMessage("Compte administrateur créé.");
      window.location.assign("/admin/login");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Création impossible.");
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <Link className="brand" href="/" aria-label="SARC Consulting, accueil">
          <Image className="brand-logo" src="/images/sarc-logo-dark.png" alt="" width={268} height={75} priority />
        </Link>
        <span className="admin-auth-kicker">Première configuration</span>
        <h1>Créer le compte administrateur</h1>
        <p>Ce compte permet de gérer les contenus et les demandes reçues depuis le site.</p>
        <form className="admin-auth-form" onSubmit={submit}>
          <label>Nom complet<input name="name" autoComplete="name" required minLength={2} /></label>
          <label>Adresse email<input name="email" type="email" autoComplete="email" required /></label>
          <label>Mot de passe<input name="password" type="password" autoComplete="new-password" required minLength={12} /></label>
          <div className="honeypot" aria-hidden="true"><label>Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
          <button className="admin-primary-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Création..." : "Créer le compte"}
          </button>
          <p className="admin-auth-message" role="status">{message}</p>
        </form>
      </section>
    </main>
  );
}
