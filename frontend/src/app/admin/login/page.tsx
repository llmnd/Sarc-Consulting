"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, LockKeyhole, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginError = params.get("error");
    if (loginError) {
      setStatus("error");
      setMessage(loginError);
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setStatus("loading");
    setMessage("");
    const data = new FormData(form);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
          website: data.get("website"),
        }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.detail);
      window.location.assign("/admin");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Connexion impossible.");
    }
  }

  return (
    <main className="admin-auth-page">
      <Link className="admin-auth-home" href="/" aria-label="Retour à l’accueil">
        <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" />
        <span>Accueil</span>
      </Link>
      <section className="admin-auth-card">
        <aside className="admin-auth-visual">
          <Link className="brand" href="/" aria-label="SARC Consulting, accueil">
            <Image className="brand-logo brand-logo-light" src="/images/sarc-logo-light.png" alt="" width={268} height={75} priority />
          </Link>
          <div>
            <span className="admin-auth-kicker">Administration</span>
            <h2>L’excellence commence par un accès sécurisé.</h2>
            <p>Gérez les contenus, les actualités et les demandes reçues depuis votre espace SARC.</p>
          </div>
          <span className="admin-auth-visual-mark" aria-hidden="true">S</span>
        </aside>
        <div className="admin-auth-form-panel">
          <span className="admin-auth-kicker">Espace privé</span>
          <h1>Bon retour.</h1>
          <p>Connectez-vous pour accéder au tableau de bord.</p>
          <form className="admin-auth-form" method="post" action="/api/admin/login" onSubmit={submit}>
            <label>
              Adresse email
              <span className="admin-auth-field">
                <Mail size={16} strokeWidth={1.7} aria-hidden="true" />
                <input name="email" type="email" autoComplete="email" placeholder="nom@entreprise.com" required />
              </span>
            </label>
            <label>
              Mot de passe
              <span className="admin-auth-field">
                <LockKeyhole size={16} strokeWidth={1.7} aria-hidden="true" />
                <input name="password" type="password" autoComplete="current-password" placeholder="Votre mot de passe" required />
              </span>
            </label>
            <div className="honeypot" aria-hidden="true"><label>Ne pas remplir<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            <button className="admin-primary-button" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Connexion..." : "Se connecter"}
            </button>
            <p className="admin-auth-message" role="status">{message}</p>
          </form>
        </div>
      </section>
    </main>
  );
}
